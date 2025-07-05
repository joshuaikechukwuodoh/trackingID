import { PrismaClient } from "@prisma/client";
import { generateToken } from "../utils/generateToken.js";

const prisma = new PrismaClient();

const validateTrackingData = (data) => {
  const requiredFields = ['status']; // trackingId is now auto-generated
  const errors = [];
  
  requiredFields.forEach(field => {
    if (!data[field]) {
      errors.push(`Missing required field: ${field}`);
    }
  });
  
  // Add additional validation as needed
  if (data.estimatedDelivery && isNaN(Date.parse(data.estimatedDelivery))) {
    errors.push('Invalid estimatedDelivery date format');
  }
  
  return errors;
};

export const createTracking = async (req, res) => {
  try {
    const { status, origin, destination, currentLocation, notes, estimatedDelivery } = req.body;
    
    const errors = validateTrackingData(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    // Generate trackingId automatically
    const trackingId = generateToken();

    // Check for duplicate trackingId (very unlikely, but good practice)
    const existingTracking = await prisma.tracking.findUnique({
      where: { trackingId }
    });
    if (existingTracking) {
      return res.status(400).json({ error: "Tracking ID already exists. Please try again." });
    }

    const tracking = await prisma.tracking.create({
      data: {
        trackingId,
        status,
        origin,
        destination,
        currentLocation,
        notes,
        estimatedDelivery: estimatedDelivery ? new Date(estimatedDelivery) : undefined,
      },
    });
    
    return res.status(201).json({ tracking });
  } catch (error) {
    console.error('Create tracking error:', error);
    return res.status(500).json({ error: "Internal server error" });
  } finally {
    await prisma.$disconnect();
  }
};

export const getTracking = async (req, res) => {
  try {
    const tracking = await prisma.tracking.findUnique({
      where: {
        trackingId: req.params.trackingId,
      },
    });
    
    if (!tracking) {
      return res.status(404).json({ error: "Tracking not found" });
    }
    
    return res.status(200).json(tracking);
  } catch (error) {
    console.error('Get tracking error:', error);
    return res.status(500).json({ error: "Internal server error" });
  } finally {
    await prisma.$disconnect();
  }
};

export const updateTracking = async (req, res) => {
  try {
    const { trackingId, status, origin, destination, currentLocation, notes, estimatedDelivery } = req.body;
    
    const errors = validateTrackingData(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const tracking = await prisma.tracking.update({
      where: {
        trackingId: req.params.trackingId,
      },
      data: {
        trackingId,
        status,
        origin,
        destination,
        currentLocation,
        notes,
        estimatedDelivery: estimatedDelivery ? new Date(estimatedDelivery) : undefined,
      },
    });
    
    return res.status(200).json(tracking);
  } catch (error) {
    console.error('Update tracking error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: "Tracking not found" });
    }
    return res.status(500).json({ error: "Internal server error" });
  } finally {
    await prisma.$disconnect();
  }
};

export const deleteTracking = async (req, res) => {
  try {
    const tracking = await prisma.tracking.delete({
      where: {
        trackingId: req.params.trackingId,
      },
    });
    
    return res.status(200).json(tracking);
  } catch (error) {
    console.error('Delete tracking error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: "Tracking not found" });
    }
    return res.status(500).json({ error: "Internal server error" });
  } finally {
    await prisma.$disconnect();
  }
};
import prisma from "../dbconnexion.js";

export const createReport = async (req, res) => {
    const { name, email, incidentDate, description, category, latitude, longitude } = req.body;

    try {
      const date = new Date(incidentDate);
      const newReport = await prisma.report.create({
        data: {
          name,
          email,
          incidentDate:date,
          description,
          category,
          latitude,
          longitude,
        },
      });
  
      res.status(201).json(newReport);
    } catch (error) {
      console.error("Error creating report:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  
export const getReports = async (req, res) => {
  try {
    const reports = await prisma.report.findMany();
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch reports" });
  }
};

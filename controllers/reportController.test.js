import { createReport, getReports } from '../controllers/reportController';
import prisma from '../dbconnexion';

jest.mock('../dbconnexion', () => ({
  report: {
    create: jest.fn(),
    findMany: jest.fn(),
  },
}));

describe('Report Controller', () => {
  describe('createReport', () => {
    it('should create a new report', async () => {
      const req = {
        body: {
          name: 'John Doe',
          description: 'Incident description',
          location: 'Location',
          incidentDate: '2023-01-01',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const newReport = { id: 1, ...req.body, incidentDate: new Date('2023-01-01') };
      prisma.report.create.mockResolvedValue(newReport);

      await createReport(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(newReport);
    });

    it('should handle errors', async () => {
      const req = {
        body: {
          name: 'John Doe',
          description: 'Incident description',
          location: 'Location',
          incidentDate: '2023-01-01',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const error = new Error('Failed to create report');
      prisma.report.create.mockRejectedValue(error);

      await createReport(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('getReports', () => {
    it('should fetch all reports', async () => {
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const reports = [
        { id: 1, name: 'John Doe', description: 'Incident description' },
        { id: 2, name: 'Jane Doe', description: 'Another incident' },
      ];
      prisma.report.findMany.mockResolvedValue(reports);

      await getReports({}, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(reports);
    });

    it('should handle errors', async () => {
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const error = new Error('Failed to fetch reports');
      prisma.report.findMany.mockRejectedValue(error);

      await getReports({}, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: error.message });
    });
  });
});

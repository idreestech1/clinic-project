import { Appointment } from "../models/Appointment.js";
import { User } from "../models/User.js";

export const getPatients = async (_req, res, next) => {
  try {
    const users = await User.find({ role: "patient" }).sort({ createdAt: -1 });
    const appointments = await Appointment.find().sort({ date: -1, time: -1 }).lean();

    const patients = users.map((user) => {
      const patient = user.toJSON();
      const lastAppointment = appointments.find((appointment) => appointment.email === patient.email);

      return {
        ...patient,
        id: `#PT-${String(patient.email).slice(0, 2).toUpperCase()}-${String(patient.createdAt).slice(2, 10).replaceAll("-", "")}`,
        lastVisit: lastAppointment?.date || "No visits yet",
        visitTime: lastAppointment ? `${lastAppointment.time} (Dr. Hammad)` : "Not scheduled",
      };
    });

    res.json({ patients });
  } catch (err) {
    next(err);
  }
};

export const updatePatient = async (req, res, next) => {
  try {
    const patient = await User.findOneAndUpdate(
      { _id: req.params.id, role: "patient" },
      req.body,
      { new: true, runValidators: true }
    );

    if (!patient) {
      res.status(404).json({ message: "Patient not found." });
      return;
    }

    res.json({ patient: patient.toJSON() });
  } catch (err) {
    next(err);
  }
};

export const deletePatient = async (req, res, next) => {
  try {
    await User.deleteOne({ _id: req.params.id, role: "patient" });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

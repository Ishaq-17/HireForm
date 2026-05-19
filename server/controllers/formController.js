import Form from '../models/Form.js';
import Submission from '../models/Submission.js';
import { mockDb } from '../utils/mockDb.js';

export const createForm = async (req, res) => {
  const { title, description, fields, isActive, deadline } = req.body;

  if (!title) {
    return res.status(400).json({ message: 'Form Title is required.' });
  }

  const cleanedTitle = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  const randomStr = Math.random().toString(36).substring(2, 8);
  const slug = `${cleanedTitle}-${randomStr}`;

  if (global.useMockDb) {
    const newForm = {
      _id: `mock-form-${Date.now()}`,
      recruiterId: req.user.id,
      title,
      description,
      slug,
      fields: fields.map((f, idx) => ({ ...f, _id: `mock-field-${idx}-${Date.now()}` })),
      isActive: isActive !== undefined ? isActive : true,
      deadline,
      createdAt: new Date(),
    };
    mockDb.forms.push(newForm);
    return res.status(201).json(newForm);
  }

  try {
    const newForm = new Form({
      recruiterId: req.user.id,
      title,
      description,
      slug,
      fields,
      isActive: isActive !== undefined ? isActive : true,
      deadline,
    });

    await newForm.save();
    return res.status(201).json(newForm);
  } catch (error) {
    console.error('Create Form Error', error);
    return res.status(500).json({ message: 'Failed to create recruitment form.' });
  }
};

export const getRecruiterForms = async (req, res) => {
  if (global.useMockDb) {
    const forms = mockDb.forms.filter(f => f.recruiterId === req.user.id);
    const formsWithCounts = forms.map(f => {
      const count = mockDb.submissions.filter(s => s.formId === f._id).length;
      return { ...f, submissionCount: count };
    });
    return res.json(formsWithCounts);
  }

  try {
    const forms = await Form.find({ recruiterId: req.user.id }).sort({ createdAt: -1 });
    const formsWithCounts = await Promise.all(
      forms.map(async (form) => {
        const count = await Submission.countDocuments({ formId: form._id });
        return {
          ...form.toObject(),
          submissionCount: count,
        };
      })
    );
    return res.json(formsWithCounts);
  } catch (error) {
    console.error('Fetch Forms Error', error);
    return res.status(500).json({ message: 'Failed to fetch forms.' });
  }
};

export const getFormById = async (req, res) => {
  if (global.useMockDb) {
    const form = mockDb.forms.find(f => f._id === req.params.id && f.recruiterId === req.user.id);
    if (!form) {
      return res.status(404).json({ message: 'Form not found or access denied.' });
    }
    return res.json(form);
  }

  try {
    const form = await Form.findOne({ _id: req.params.id, recruiterId: req.user.id });
    if (!form) {
      return res.status(404).json({ message: 'Form not found or access denied.' });
    }
    return res.json(form);
  } catch (error) {
    console.error('Fetch Form Detail Error', error);
    return res.status(500).json({ message: 'Failed to fetch form detail.' });
  }
};

export const getPublicFormBySlug = async (req, res) => {
  if (global.useMockDb) {
    const form = mockDb.forms.find(f => f.slug === req.params.slug);
    if (!form) {
      return res.status(404).json({ message: 'The requested recruitment form does not exist.' });
    }
    if (!form.isActive) {
      return res.status(400).json({ message: 'This application form is currently closed or inactive.' });
    }
    return res.json(form);
  }

  try {
    const form = await Form.findOne({ slug: req.params.slug });
    if (!form) {
      return res.status(404).json({ message: 'The requested recruitment form does not exist.' });
    }
    if (!form.isActive) {
      return res.status(400).json({ message: 'This application form is currently closed or inactive.' });
    }
    return res.json(form);
  } catch (error) {
    console.error('Fetch Public Form Error', error);
    return res.status(500).json({ message: 'Failed to fetch the form schema.' });
  }
};

export const deleteForm = async (req, res) => {
  if (global.useMockDb) {
    const formIdx = mockDb.forms.findIndex(f => f._id === req.params.id && f.recruiterId === req.user.id);
    if (formIdx === -1) {
      return res.status(404).json({ message: 'Form not found or access denied.' });
    }
    const formId = mockDb.forms[formIdx]._id;
    mockDb.forms.splice(formIdx, 1);
    mockDb.submissions = mockDb.submissions.filter(s => s.formId !== formId);
    return res.json({ message: 'Job form and all submissions successfully deleted.' });
  }

  try {
    const form = await Form.findOne({ _id: req.params.id, recruiterId: req.user.id });
    if (!form) {
      return res.status(404).json({ message: 'Form not found or access denied.' });
    }

    await Promise.all([
      Form.deleteOne({ _id: form._id }),
      Submission.deleteMany({ formId: form._id }),
    ]);

    return res.json({ message: 'Job form and all submissions successfully deleted.' });
  } catch (error) {
    console.error('Delete Form Error', error);
    return res.status(500).json({ message: 'Failed to delete recruitment form.' });
  }
};

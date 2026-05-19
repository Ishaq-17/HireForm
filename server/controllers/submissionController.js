import Submission from '../models/Submission.js';
import Form from '../models/Form.js';
import { mockDb } from '../utils/mockDb.js';

export const submitResponse = async (req, res) => {
  const { formId } = req.params;
  const { responses } = req.body;

  if (global.useMockDb) {
    const form = mockDb.forms.find(f => f._id === formId);
    if (!form) {
      return res.status(404).json({ message: 'The requested recruitment form does not exist.' });
    }
    if (!form.isActive) {
      return res.status(400).json({ message: 'This application form is currently closed or inactive.' });
    }

    for (let field of form.fields) {
      const response = responses.find((r) => r.fieldLabel === field.label);
      if (field.required && (!response || !response.value.trim())) {
        return res.status(400).json({ message: `"${field.label}" is a required field.` });
      }
      if (response && response.value.trim() && field.label.toLowerCase().includes('email')) {
        if (!response.value.trim().toLowerCase().endsWith('@gmail.com')) {
          return res.status(400).json({ message: `"${field.label}" must be a valid email ending with @gmail.com.` });
        }
      }
      if (field.type === 'Dropdown' && response && response.value.trim()) {
        if (!field.options.includes(response.value)) {
          return res.status(400).json({ message: `Invalid option selected for "${field.label}".` });
        }
      }
    }

    const newSubmission = {
      _id: `mock-sub-${Date.now()}`,
      formId: form._id,
      recruiterId: form.recruiterId,
      responses,
      status: 'New',
      createdAt: new Date(),
    };
    mockDb.submissions.push(newSubmission);
    return res.status(201).json({ message: 'Application submitted successfully.', submission: newSubmission });
  }

  try {
    const form = await Form.findById(formId);
    if (!form) {
      return res.status(404).json({ message: 'The requested recruitment form does not exist.' });
    }
    if (!form.isActive) {
      return res.status(400).json({ message: 'This application form is currently closed or inactive.' });
    }

    for (let field of form.fields) {
      const response = responses.find((r) => r.fieldLabel === field.label);

      if (field.required && (!response || !response.value.trim())) {
        return res.status(400).json({ message: `"${field.label}" is a required field.` });
      }

      if (response && response.value.trim() && field.label.toLowerCase().includes('email')) {
        if (!response.value.trim().toLowerCase().endsWith('@gmail.com')) {
          return res.status(400).json({ message: `"${field.label}" must be a valid email ending with @gmail.com.` });
        }
      }

      if (field.type === 'Dropdown' && response && response.value.trim()) {
        if (!field.options.includes(response.value)) {
          return res.status(400).json({ message: `Invalid option selected for "${field.label}".` });
        }
      }
    }

    const newSubmission = new Submission({
      formId: form._id,
      recruiterId: form.recruiterId,
      responses,
      status: 'New',
    });

    await newSubmission.save();
    return res.status(201).json({ message: 'Application submitted successfully.', submission: newSubmission });
  } catch (error) {
    console.error('Submit Response Error', error);
    return res.status(500).json({ message: 'Failed to process application submission.' });
  }
};

export const getFormSubmissions = async (req, res) => {
  const { formId } = req.params;

  if (global.useMockDb) {
    const form = mockDb.forms.find(f => f._id === formId && f.recruiterId === req.user.id);
    if (!form) {
      return res.status(404).json({ message: 'Form not found or access denied.' });
    }
    const submissions = mockDb.submissions
      .filter(s => s.formId === formId && s.recruiterId === req.user.id)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return res.json(submissions);
  }

  try {
    const form = await Form.findOne({ _id: formId, recruiterId: req.user.id });
    if (!form) {
      return res.status(404).json({ message: 'Form not found or access denied.' });
    }

    const submissions = await Submission.find({ formId, recruiterId: req.user.id }).sort({ createdAt: -1 });
    return res.json(submissions);
  } catch (error) {
    console.error('Fetch Submissions Error', error);
    return res.status(500).json({ message: 'Failed to fetch candidate submissions.' });
  }
};

export const getSubmissionDetail = async (req, res) => {
  if (global.useMockDb) {
    const submission = mockDb.submissions.find(s => s._id === req.params.id && s.recruiterId === req.user.id);
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found or access denied.' });
    }
    const form = mockDb.forms.find(f => f._id === submission.formId);
    return res.json({
      ...submission,
      formId: form ? { _id: form._id, title: form.title, description: form.description } : null
    });
  }

  try {
    const submission = await Submission.findOne({
      _id: req.params.id,
      recruiterId: req.user.id,
    }).populate('formId', 'title description');

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found or access denied.' });
    }

    return res.json(submission);
  } catch (error) {
    console.error('Fetch Submission Detail Error', error);
    return res.status(500).json({ message: 'Failed to fetch submission details.' });
  }
};

export const updateSubmissionStatus = async (req, res) => {
  const { status } = req.body;

  if (!['New', 'Reviewed', 'Shortlisted', 'Rejected'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status pipeline stage.' });
  }

  if (global.useMockDb) {
    const subIdx = mockDb.submissions.findIndex(s => s._id === req.params.id && s.recruiterId === req.user.id);
    if (subIdx === -1) {
      return res.status(404).json({ message: 'Submission not found or access denied.' });
    }
    mockDb.submissions[subIdx].status = status;
    const submission = mockDb.submissions[subIdx];
    const form = mockDb.forms.find(f => f._id === submission.formId);
    return res.json({
      ...submission,
      formId: form ? { _id: form._id, title: form.title, description: form.description } : null
    });
  }

  try {
    const submission = await Submission.findOneAndUpdate(
      { _id: req.params.id, recruiterId: req.user.id },
      { status },
      { new: true }
    ).populate('formId', 'title description');

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found or access denied.' });
    }

    return res.json(submission);
  } catch (error) {
    console.error('Update Status Error', error);
    return res.status(500).json({ message: 'Failed to update pipeline stage.' });
  }
};

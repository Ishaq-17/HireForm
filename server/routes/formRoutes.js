import express from 'express';
import {
  createForm,
  getRecruiterForms,
  getFormById,
  getPublicFormBySlug,
  deleteForm,
} from '../controllers/formController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, createForm);
router.get('/', authMiddleware, getRecruiterForms);
router.get('/:id', authMiddleware, getFormById);
router.delete('/:id', authMiddleware, deleteForm);
router.get('/public/:slug', getPublicFormBySlug);

export default router;

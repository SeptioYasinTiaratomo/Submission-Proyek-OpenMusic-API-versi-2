const Joi = require('joi');

const songSchema = Joi.object({
  title: Joi.string().required().messages({
    'string.base': '"title" harus berupa teks',
    'string.empty': '"title" tidak boleh kosong',
    'any.required': '"title" wajib diisi',
  }),
  year: Joi.number().integer().min(1900).max(new Date().getFullYear()).required().messages({
    'number.base': '"year" harus berupa angka',
    'number.min': '"year" minimal 1900',
    'number.max': `"year" maksimal ${new Date().getFullYear()}`,
    'any.required': '"year" wajib diisi',
  }),
  genre: Joi.string().required().messages({
    'string.base': '"genre" harus berupa teks',
    'string.empty': '"genre" tidak boleh kosong',
    'any.required': '"genre" wajib diisi',
  }),
  performer: Joi.string().required().messages({
    'string.base': '"performer" harus berupa teks',
    'string.empty': '"performer" tidak boleh kosong',
    'any.required': '"performer" wajib diisi',
  }),
  duration: Joi.number().integer().optional().messages({
    'number.base': '"duration" harus berupa angka',
  }),
  albumId: Joi.string().optional().messages({
    'string.base': '"albumId" harus berupa string',
  }),
});

module.exports = { songSchema };

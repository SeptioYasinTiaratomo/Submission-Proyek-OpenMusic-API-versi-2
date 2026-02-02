const Joi = require('joi');

const albumSchema = Joi.object({
  name: Joi.string().required().messages({
    'string.base': '"name" harus berupa teks',
    'string.empty': '"name" tidak boleh kosong',
    'any.required': '"name" wajib diisi',
  }),
  year: Joi.number().integer().min(1900).max(new Date().getFullYear()).required().messages({
    'number.base': '"year" harus berupa angka',
    'number.integer': '"year" harus berupa bilangan bulat',
    'number.min': '"year" tidak boleh kurang dari 1900',
    'number.max': '"year" tidak boleh lebih dari tahun saat ini',
    'any.required': '"year" wajib diisi',
  }),
});

module.exports = { albumSchema };
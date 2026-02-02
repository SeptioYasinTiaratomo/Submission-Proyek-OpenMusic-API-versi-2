// Hapus exports.shorthands jika ada

exports.up = (pgm) => {
  pgm.createTable('songs', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    title: {
      type: 'TEXT',
      notNull: true,
    },
    year: {
      type: 'INTEGER',
      notNull: true,
    },
    genre: {
      type: 'TEXT',
      notNull: true,
    },
    performer: {
      type: 'TEXT',
      notNull: true,
    },
    duration: {
      type: 'INTEGER',
      allowNull: true,
    },
    album_id: {
      type: 'VARCHAR(50)',
      allowNull: true,
      references: '"albums"', // Pastikan nama tabel referensi pakai kutip dua agar aman
      onDelete: 'SET NULL',   // Aturan hapus sesuai soal
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('songs');
};
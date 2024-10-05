/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  // membuat user baru.
  pgm.sql("INSERT INTO albums(id, name, year) VALUES ('old_songs', 'old_songs', 2024)");

  // mengubah nilai song pada song yang song-nya bernilai NULL
  pgm.sql("UPDATE songs SET album_id = 'old_songs' WHERE album_id IS NULL");

  // memberikan constraint foreign key pada song terhadap kolom id dari tabel albums
  pgm.addConstraint('songs', 'fk_songs.album_id_albums.id', 'FOREIGN KEY(album_id) REFERENCES albums(id) ON DELETE CASCADE');
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  // menghapus constraint fk_playlists.song_albums.id pada tabel playlists
  pgm.dropConstraint('songs', 'fk_songs.album_id_albums.id');

  // mengubah nilai album_id old_songs pada note menjadi NULL
  pgm.sql("UPDATE songs SET album_id = NULL WHERE album_id = 'old_songs'");

  // menghapus user baru.
  pgm.sql("DELETE FROM albums WHERE id = 'old_songs'");
};

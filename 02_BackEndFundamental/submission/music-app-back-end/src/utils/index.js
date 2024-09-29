const mapDBToModelAlbums = ({
  id,
  name,
  year,
}) => ({
  id,
  name,
  year,
});

const mapDBToModelAllSongs = ({
  id,
  title,
  performer,
}) => ({
  id,
  title,
  performer,
});

const mapDBToModelSongs = ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  albumId,
}) => ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  albumId,
});

module.exports = { mapDBToModelAlbums, mapDBToModelAllSongs, mapDBToModelSongs };

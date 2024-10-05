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

const mapDBToModelAllPlaylists = ({
  id,
  name,
  owner: username,
}) => ({
  id,
  name,
  username,
});

const mapDBToModelSongs = ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  album_id,
}) => ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  album_id,
});

module.exports = {
  mapDBToModelAlbums, mapDBToModelAllSongs, mapDBToModelSongs, mapDBToModelAllPlaylists,
};

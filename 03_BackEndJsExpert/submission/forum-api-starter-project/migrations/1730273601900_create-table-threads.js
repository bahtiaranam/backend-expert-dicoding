/* eslint-disable camelcase */
exports.up = (pgm) => {
  pgm.createTable("threads", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    title: {
      type: "VARCHAR(50)",
      notNull: true,
    },
    body: {
      type: "TEXT",
      notNull: true,
    },
    username: {
      type: "VARCHAR(50)",
      notNull: true,
    },
    owner: {
      type: "VARCHAR(50)",
      notNull: true,
    },
    date: {
      type: "TIMESTAMP",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });

  pgm.createTable("comments", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    thread_id: {
      type: "VARCHAR(50)",
      notNull: true,
      references: '"threads"',
      onDelete: "CASCADE",
    },
    username: {
      type: "VARCHAR(50)",
      notNull: true,
    },
    content: {
      type: "TEXT",
      notNull: true,
    },
    owner: {
      type: "VARCHAR(50)",
      notNull: true,
    },
    is_deleted: {
      type: "BOOLEAN",
      notNull: true,
      default: false,
    },
    date: {
      type: "TIMESTAMP",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });

  pgm.addConstraint("comments", "fk_comments.thread_id_threads.id", {
    foreignKeys: {
      columns: "thread_id",
      references: "threads(id)",
      onDelete: "CASCADE",
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("threads");
  pgm.dropTable("comments");
};

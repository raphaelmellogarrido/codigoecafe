/// <reference path="../pb_data/types.d.ts" />

// Cria a coleção "posts" do blog.
// Regras: público só vê posts publicados; um utilizador autenticado
// (o autor, na coleção "users") vê tudo — incluindo rascunhos — e
// é o único que pode criar/editar/apagar.
migrate(
  (app) => {
    const collection = new Collection({
      type: "base",
      name: "posts",
      listRule: 'status = "published" || @request.auth.id != ""',
      viewRule: 'status = "published" || @request.auth.id != ""',
      createRule: '@request.auth.id != ""',
      updateRule: '@request.auth.id != ""',
      deleteRule: '@request.auth.id != ""',
      fields: [
        {
          type: "text",
          name: "title",
          required: true,
          max: 200,
        },
        {
          type: "text",
          name: "slug",
          required: true,
          max: 200,
          pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$",
        },
        {
          type: "text",
          name: "excerpt",
          max: 400,
        },
        {
          type: "text",
          name: "content",
          required: true,
        },
        {
          type: "text",
          name: "tags",
        },
        {
          type: "select",
          name: "status",
          required: true,
          maxSelect: 1,
          values: ["draft", "published"],
        },
        {
          type: "date",
          name: "publishedAt",
        },
      ],
      indexes: ["CREATE UNIQUE INDEX idx_posts_slug ON posts (slug)"],
    });

    app.save(collection);
  },
  (app) => {
    const collection = app.findCollectionByNameOrId("posts");
    app.delete(collection);
  }
);

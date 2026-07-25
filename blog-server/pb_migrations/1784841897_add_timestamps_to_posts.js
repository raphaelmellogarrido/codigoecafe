/// <reference path="../pb_data/types.d.ts" />

// Adiciona os campos "created"/"updated" à coleção "posts" — não foram
// incluídos na migração inicial e são úteis para ordenar no painel do autor.
migrate(
  (app) => {
    const collection = app.findCollectionByNameOrId("posts");

    collection.fields.add(
      new Field({
        type: "autodate",
        name: "created",
        onCreate: true,
      })
    );
    collection.fields.add(
      new Field({
        type: "autodate",
        name: "updated",
        onCreate: true,
        onUpdate: true,
      })
    );

    app.save(collection);
  },
  (app) => {
    const collection = app.findCollectionByNameOrId("posts");
    collection.fields.removeByName("created");
    collection.fields.removeByName("updated");
    app.save(collection);
  }
);

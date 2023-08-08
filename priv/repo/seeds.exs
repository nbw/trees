# Script for populating the database. You can run it as:
#
#     mix run priv/repo/seeds.exs
#
# Inside the script, you can read and write to any of your
# repositories directly:
#
#     Trees.Repo.insert!(%Trees.SomeSchema{})
#
# We recommend using the bang functions (`insert!`, `update!`
# and so on) as they will fail if something goes wrong.

Trees.Forest.create_tree(%{type: "oak", x: 1, y: 1})
Trees.Forest.create_tree(%{type: "oak", x: 100, y: 100})
Trees.Forest.create_tree(%{type: "oak", x: 400, y: 400})
Trees.Forest.create_tree(%{type: "oak", x: 500, y: 200})
Trees.Forest.create_tree(%{type: "oak", x: 600, y: 500})
Trees.Forest.create_tree(%{type: "oak", x: 700, y: 700})
Trees.Forest.create_tree(%{type: "oak", x: 800, y: 1000})

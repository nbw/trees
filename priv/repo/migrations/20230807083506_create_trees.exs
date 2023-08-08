defmodule Trees.Repo.Migrations.CreateTrees do
  use Ecto.Migration

  def change do
    create table(:trees) do
      add :type, :string
      add :x, :integer
      add :y, :integer

      timestamps()
    end
  end
end

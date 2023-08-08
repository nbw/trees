defmodule Trees.Forest.Tree do
  use Ecto.Schema
  import Ecto.Changeset

  schema "trees" do
    field :type, :string
    field :y, :integer
    field :x, :integer

    timestamps()
  end

  @doc false
  def changeset(tree, attrs) do
    tree
    |> cast(attrs, [:type, :x, :y])
    |> validate_required([:type, :x, :y])
  end

  defmodule Search do
    use Ecto.Schema
    import Ecto.Changeset

    @cast ~w(x1 x2 y1 y2)a
    @required ~w(x1 x2 y1 y2)a

    embedded_schema do
      field :x1, :integer
      field :x2, :integer
      field :y1, :integer
      field :y2, :integer
    end

    @doc false
    def changeset(attrs) do
      %Trees.Forest.Tree.Search{}
      |> cast(attrs, @cast)
      |> validate_required(@required)
      |> validate_search_range(:x2, :x1)
      |> validate_search_range(:y2, :y1)
    end

    @doc false
    def validate_search_range(changeset, field, ref_field) do
      validate_change(changeset, field, fn _f, a ->
        b = get_change(changeset, ref_field)
        if a < b do
          [{field, "#{field} cannot be less than or equal to #{ref_field}"}]
        else
          []
        end
      end)
    end

  end
end

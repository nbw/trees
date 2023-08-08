defmodule Trees.ForestTest do
  use Trees.DataCase

  alias Trees.Forest

  describe "trees" do
    alias Trees.Forest.Tree

    import Trees.ForestFixtures

    @invalid_attrs %{type: nil, y: nil, x: nil}

    test "list_trees/0 returns all trees" do
      tree = tree_fixture()
      assert Forest.list_trees() == [tree]
    end

    test "get_tree!/1 returns the tree with given id" do
      tree = tree_fixture()
      assert Forest.get_tree!(tree.id) == tree
    end

    test "create_tree/1 with valid data creates a tree" do
      valid_attrs = %{type: "some type", y: 42, x: 42}

      assert {:ok, %Tree{} = tree} = Forest.create_tree(valid_attrs)
      assert tree.type == "some type"
      assert tree.y == 42
      assert tree.x == 42
    end

    test "create_tree/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Forest.create_tree(@invalid_attrs)
    end

    test "update_tree/2 with valid data updates the tree" do
      tree = tree_fixture()
      update_attrs = %{type: "some updated type", y: 43, x: 43}

      assert {:ok, %Tree{} = tree} = Forest.update_tree(tree, update_attrs)
      assert tree.type == "some updated type"
      assert tree.y == 43
      assert tree.x == 43
    end

    test "update_tree/2 with invalid data returns error changeset" do
      tree = tree_fixture()
      assert {:error, %Ecto.Changeset{}} = Forest.update_tree(tree, @invalid_attrs)
      assert tree == Forest.get_tree!(tree.id)
    end

    test "delete_tree/1 deletes the tree" do
      tree = tree_fixture()
      assert {:ok, %Tree{}} = Forest.delete_tree(tree)
      assert_raise Ecto.NoResultsError, fn -> Forest.get_tree!(tree.id) end
    end

    test "change_tree/1 returns a tree changeset" do
      tree = tree_fixture()
      assert %Ecto.Changeset{} = Forest.change_tree(tree)
    end
  end
end

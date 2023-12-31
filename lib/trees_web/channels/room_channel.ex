defmodule TreeWeb.RoomChannel do
  use Phoenix.Channel

  @impl true
  def join("room:lobby", _message, socket) do
    {:ok, socket}
  end

  def join("room:" <> _private_room_id, _params, _socket) do
    {:error, %{reason: "unauthorized"}}
  end

  @impl true
  def handle_in("tree:new", params, socket) do
    with {:ok, tree} <- Trees.Forest.create_tree(params) do
      broadcast!(socket, "tree:new", %{id: tree.id, type: tree.type, x: tree.x, y: tree.y})
      {:noreply, socket}
    end
  end

  def handle_in("tree:destroy", %{"id"=> id}, socket) do
    with %Trees.Forest.Tree{} = tree <- Trees.Forest.get_tree!(id),
      {:ok, _tree} <- Trees.Forest.delete_tree(tree)
    do
      broadcast!(socket, "tree:destroy", %{id: tree.id, type: tree.type, x: tree.x, y: tree.y})
      {:noreply, socket}
    end
  end
end

defmodule TreesWeb.PubSub do
  alias Phoenix.PubSub

  def subscribe(topic) do
    PubSub.subscribe(Trees.PubSub, topic)
  end

  def broadcast(topic, data) do
    PubSub.broadcast(Trees.PubSub, topic, data)
  end
end

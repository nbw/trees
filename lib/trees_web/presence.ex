defmodule TreesWeb.Presence do
  use Phoenix.Presence,
    otp_app: :trees,
    pubsub_server: Trees.PubSub

  def user_count(topic) do
    __MODULE__.list(topic)
    |> Map.keys()
    |> length
  end
end

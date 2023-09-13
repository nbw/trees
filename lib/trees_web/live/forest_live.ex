defmodule TreesWeb.ForestLive do
  use TreesWeb, :live_view

  import TreesWeb.Components.UsersComponent

  alias Pho

  @impl true
  def render(assigns) do
    ~H"""
    <.users_list
      user_count={@user_count}
      users={@users}
      me={@me}
    />
    <.modal id="modal" show={true} on_cancel={JS.hide(transition: "fade-out", to: "#modal")}>
      <p class="mb-2 text-center">
        Welcome to <i>TREES</i>.
      </p>
      <div class="text-center">
        <button
          id="modal-sound"
          phx-click={JS.hide(transition: "fade-out", to: "#modal")}
          class="border rounded-md font-bold p-4 mx-auto my-4 bg-white/10 hover:bg-white/25">
          Enable sound
          <.icon name="hero-speaker-wave" />
          to continue
        </button>
      </div>
      <hr />
      <div class="flex flex-col items-center mt-2 mb-4">
        <h2>How</h2>
        <ul class="list-disc ml-4">
          <li>Drag-click scroll to explore map</li>
          <li>Click to create a tree</li>
          <li>Top-right show users by region</li>
        </ul>
      </div>
      <hr />
      <div class="flex flex-col items-center">
        <p class="my-2">
          Powered by:
        </p>
        <ul class="list-disc ml-4">
          <li>Fly.io</li>
          <li>Litefs</li>
          <li>Elixir/Phoenix</li>
          <li>Haphazardly coded JS</li>
        </ul>
      </div>
    </.modal>
    <div id="app" phx-update="ignore">
      <div id="menu" class="absolute z-10 pointer-events-none">
        <div class="p-4 flex flex-col space-y-4">
          <div data-type="tree:seq" class="group item pointer-events-auto flex items-center">
            <div class="rounded-full w-10 h-10 border border-gray-400 hover:bg-gray-500/20">
              <img src="/images/trees/seq_logo.png" class="w-10 h-[2.45rem]"/>
            </div>
            <span class="mx-2 text-white transition-all opacity-0 group-hover:opacity-100">seq</span>
          </div>
          <div data-type="tree:sakura" class="group item pointer-events-auto flex items-center">
            <div class="rounded-full w-10 h-10 border border-gray-400 hover:bg-gray-500/20">
              <img src="/images/trees/cherry_logo.png" class="w-10 h-[2.40rem]"/>
            </div>
            <span class="mx-2 text-white transition-all opacity-0 group-hover:opacity-100">cherry</span>
          </div>
          <div data-type="tree:stump" class="group item pointer-events-auto flex items-center">
            <div class="rounded-full w-10 h-10 border border-gray-400 hover:bg-gray-500/20">
              <img src="/images/trees/stump_logo.png" class="w-10 h-[2.40rem]"/>
            </div>
            <span class="mx-2 text-white transition-all opacity-0 group-hover:opacity-100">stump</span>
          </div>
          <div data-type="destroy" class="group item pointer-events-auto flex items-center">
            <div class="block p-2 rounded-md text-white border border-white cursor-pointer hover:bg-zinc-50/10">
              <.icon name="hero-trash"/>
            </div>
          </div>
          <div class="pointer-events-auto">
            <button id="sound" class="block p-2 rounded-md text-white border border-white cursor-pointer hover:bg-zinc-50/10">
              <div data-attr="on" class="hidden">
                <.icon name="hero-speaker-wave"/>
              </div>
              <div data-attr="off">
                <.icon name="hero-speaker-x-mark" />
              </div>
            </button>
          </div>
        </div>
      </div>
      <div class="w-screen h-screen">
        <div id="canvas"
          class={[
            "absolute z-0",
            "bg-gradient-to-tr from-[#000503] via-[#053026] to-[#025C71]",
            "dark:bg-slate-600 dark:bg-opacity-50 overflow-hidden"
            ]}></div>
      </div>
    </div>
    """
  end

  @topic "forest"

  @impl true
  def mount(_params, _session, socket) do
    me = %{region: System.get_env("FLY_REGION", "LOCAL-#{socket.id}")}

    if connected?(socket) do
      TreesWeb.PubSub.subscribe(@topic)
      {:ok, _} = TreesWeb.Presence.track(self(), @topic, socket.id, me)
    end

    {:ok, assign(socket, me: me, user_count: 0, users: [])}
  end

  @impl true
  def handle_info(
        %{event: "presence_diff", payload: %{joins: _joins, leaves: _leaves}},
        socket
      ) do

    users = get_users()
    socket = socket
             |> assign(:user_count, Enum.sum(Map.values(users)))
             |> assign(:users, users)


    {:noreply, socket}
  end

  def join("room:lobby", _message, socket) do
    {:ok, socket}
  end

  defp get_users() do
    TreesWeb.Presence.list(@topic)
    |> Map.values()
    |> Enum.reduce(%{}, fn x, acc ->
      Map.get(x, :metas, [])
      |> Enum.reduce(acc, fn user, _acc ->
        region = Map.get(user, :region, "LOCAL")
        Map.update(acc, region, 1, fn existing -> existing + 1 end)
      end)
    end)
  end
end

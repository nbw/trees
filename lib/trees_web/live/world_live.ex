defmodule TreesWeb.WorldLive do
  use TreesWeb, :live_view

  @impl true
  def render(assigns) do
    ~H"""
    <div class="absolute right-0 py-2 px-4 z-10 flex items-center text-white space-x-2">
      <span><%= @user_count %></span>
      <img src="/images/person.png" />
    </div>
    <div id="app" phx-update="ignore">
      <div id="menu" class="absolute z-10 pointer-events-none">
        <div class="p-4 flex flex-col space-y-4">
          <div data-type="tree:alder" class="group item pointer-events-auto flex items-center">
            <div class="rounded-full w-4 h-4 p-4 border border-gray-400 bg-orange-400 hover:bg-orange-500"></div>
            <span class="mx-2 text-white transition-all opacity-0 group-hover:opacity-100">alder</span>
          </div>
          <div data-type="tree:oak" class="group item pointer-events-auto flex items-center">
            <div class="rounded-full w-4 h-4 p-4 border border-gray-400 bg-violet-400 hover:bg-violet-500"></div>
            <span class="mx-2 text-white transition-all opacity-0 group-hover:opacity-100">cherry</span>
          </div>
          <div data-type="tree:stump" class="group item pointer-events-auto flex items-center">
            <div class="rounded-full w-4 h-4 p-4 border border-gray-400 bg-emerald-400 hover:bg-emerald-500"></div>
            <span class="mx-2 text-white transition-all opacity-0 group-hover:opacity-100">stump</span>
          </div>
          <div data-type="tree:tree" class="group item pointer-events-auto flex items-center">
            <div class="rounded-full w-4 h-4 p-4 border border-gray-400 bg-pink-400 hover:bg-pink-500"></div>
            <span class="mx-2 text-white transition-all opacity-0 group-hover:opacity-100">tree</span>
          </div>
          <div data-type="destroy" class="group item pointer-events-auto flex items-center">
            <div class="rounded-full w-4 h-4 p-4 border border-gray-400 bg-yellow-400 hover:bg-yellow-500"></div>
            <span class="mx-2 text-white transition-all opacity-0 group-hover:opacity-100">deleted</span>
          </div>
          <div class="pointer-events-auto">
            <button id="sound" class="block p-2 rounded-md bg-red-100 hover:bg-red-200">
              <.icon name="hero-speaker-wave" />
              <.icon name="hero-speaker-x-mark" />
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

  require Logger

  @topic "world"
  @impl true
  def mount(_params, _session, socket) do
    if connected?(socket) do
      TreesWeb.PubSub.subscribe(@topic)
      {:ok, _} = TreesWeb.Presence.track(self(), @topic, socket.id, %{region: System.get_env("FLY_REGION", "LOCAL")})
    end

    {:ok, assign(socket, :user_count, 0)}
  end

  @impl true
  def handle_info(
        %{event: "presence_diff", payload: %{joins: _joins, leaves: _leaves}},
        socket
      ) do
    {:noreply, assign(socket, :user_count, TreesWeb.Presence.user_count(@topic))}
  end

  def join("room:lobby", _message, socket) do
    {:ok, socket}
  end

end

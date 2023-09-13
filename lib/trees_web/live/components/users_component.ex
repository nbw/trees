defmodule TreesWeb.Components.UsersComponent do
  use TreesWeb, :html

  attr :user_count, :integer, required: true
  attr :users, :list, required: true
  attr :me, :map, required: true
  def users_list(assigns) do
    ~H"""
    <div class="absolute group right-0 py-2 px-4 z-10 text-white flex flex-col items-end">
      <ul class="">
        <li class="visible group-hover:hidden">
          <div class="flex items-center justify-end space-x-2">
            <span><%= @user_count %></span>
            <img src="/images/person.png" />
          </div>
        </li>
        <li class="invisible group-hover:visible" :for={{region, count} <- @users} class="">
          <div class={["flex items-center justify-end space-x-2", (if @me[:region] == region, do: "font-bold")]}>
            <span class="uppercase"><%= region %></span>
            <span><%= count %></span>
            <img src="/images/person.png" />
          </div>
        </li>
      </ul>
    </div>
    """
  end
end

window.onload = main;

function main()
{
	//alert("startup");
	safari.application.addEventListener("message", handleMessage, false);
	safari.application.addEventListener("command", handleCommand, false);
}

function handleMessage(event) {
	switch (event.name)
	{
		case "getBlockList":
			getBlockList(event);
			break;
		case "setBlockList":
			setBlockList(event);
			break;
		default:
			alert("unknown event.name: ", event.name);
	}
}

function handleCommand(event)
{
	if (event.command === "toolClick")
	{
		var newTab = safari.application.activeBrowserWindow.openTab();
		newTab.url = safari.extension.baseURI + "preferences.html";
		
	}
}

function getBlockList(event)
{
	event.target.page.dispatchMessage("blockList", localStorage.getItem("blockList"));
}

function setBlockList(event)
{
	localStorage.setItem("blockList", event.message);
}

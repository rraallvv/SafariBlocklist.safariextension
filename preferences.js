window.onload = main;

function main()
{
	document.getElementById("OKButton").addEventListener("click", save, false);
	safari.self.addEventListener("message", handleMessage, false);
	safari.self.tab.dispatchMessage("getBlockList");	
}

function handleMessage(event)
{
	if (event.name === "blockList")
	{
		setupWithBlockList(event.message);
	}
}

function save(event)
{
	safari.self.tab.dispatchMessage("setBlockList", document.getElementById("mainField").value);
	alert("Blocklist saved.");
}

function setupWithBlockList(blockList)
{
	document.getElementById("mainField").value = blockList;
}
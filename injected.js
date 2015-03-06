//parameters
var checkInterval = 50;
var timeToGiveUp = 3000;

//constants
var kFilterClassName = "g_filtered";

//timers
if (window.top === window)
{
	var gTimer = window.setInterval(checkToGo, checkInterval);
	var gTimerToGiveUp = window.setTimeout(giveUpToGo, timeToGiveUp);
	safari.self.addEventListener("message", handleMessage, false);
}

//variables
var gi = 0;

function checkToGo()
{
	this.resultsRoot = document.getElementById("search");
	if (!this.resultsRoot) this.resultsRoot = document.getElementById("results");
	if (resultsRoot)
	{
		clearTimers();
		go();
	}
	gi++;
}

function giveUpToGo()
{
	//alert("give up: " + gi);
	clearTimers();
}

function clearTimers()
{
	window.clearInterval(gTimer);
	window.clearTimeout(gTimerToGiveUp);
	gTimer = null;
	gTimerToGiveUp = null;
	//console.log(gi);
	gi = 0;
}

function go()
{
	safari.self.tab.dispatchMessage("getBlockList");
	addBlockLinks()
}

function handleMessage(event)
{
	if (event.name === "blockList")
	{
		filterWithBlockList(event.message);
	}
}

function getMainEntries(node)
{
	var entries = this.resultsRoot.getElementsByClassName("g");
	if (!entries.length) entries = this.resultsRoot.getElementsByClassName("sa_wr");
	return entries;
}

function filterWithBlockList(blockList)
{
	var blockURLs = blockList.split("\n");
	var nBlockURLs = blockURLs.length;
	var entries = getMainEntries(document);
	var n = entries.length;
	for (var i = 0; i < n; i++)
	{
		var entry = entries.item(i);
		var linkURL = entry.getElementsByTagName("a").item(0).getAttribute("href");
		for (var iBlockURL = 0; iBlockURL < nBlockURLs; iBlockURL++)
		{
			if (linkURL.indexOf(blockURLs[iBlockURL], 0) > 0)
			{
				entry.className += " " + kFilterClassName;
			}
		}
	}
}

function addBlockLinks()
{
	var entries = getMainEntries(document);
	var n = entries.length;
	for (var i = 0; i < n; i++)
	{
		var entry = entries.item(i);
		var a = document.createElement('a');
		var linkText = document.createTextNode("Block");
		a.appendChild(linkText);
		a.title = "Block";
		a.onclick = function () { block(this); };
		a.href = "#";
		entry.appendChild(a);
	}
}

function block(element) {
	var hostname = element.parentNode.getElementsByTagName("a").item(0).hostname;
	safari.self.tab.dispatchMessage("addEntryToBlockList", hostname);
	safari.self.tab.dispatchMessage("getBlockList");
}

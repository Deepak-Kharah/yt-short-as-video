const youtubeShortsRegex = /https:\/\/(www\.)?youtube\.com\/shorts\/(.*)/;

async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}

chrome.tabs.onUpdated.addListener(updateIconContent);

chrome.tabs.onActivated.addListener(updateIconContent);

async function updateIconContent() {
    const tab = await getCurrentTab();
    const url = tab.url;

    const isYoutubeShorts = youtubeShortsRegex.test(url);

    if (isYoutubeShorts) {
        chrome.action.setIcon({
            path: {
                16: "images/yt-open-in-new-tab-16.png",
                32: "images/yt-open-in-new-tab-32.png",
                64: "images/yt-open-in-new-tab-64.png",
                128: "images/yt-open-in-new-tab-128.png",
            },
        });

        chrome.action.setTitle({
            title: "Open YT short as video",
        });
    } else {
        chrome.action.setIcon({
            path: {
                16: "images/yt-open-in-new-tab-inactive-16.png",
                32: "images/yt-open-in-new-tab-inactive-32.png",
                64: "images/yt-open-in-new-tab-inactive-64.png",
                128: "images/yt-open-in-new-tab-inactive-128.png",
            },
        });

        chrome.action.setTitle({
            title: "Go to YouTube shorts to use this extension",
        });
    }
}

// When the user clicks on the extension action
chrome.action.onClicked.addListener(async (tab) => {
    const isYoutubeShorts = youtubeShortsRegex.test(tab.url);

    if (isYoutubeShorts) {
        const shortId = tab.url.match(youtubeShortsRegex)[2];
        const youtubeUrl = `https://www.youtube.com/watch?v=${shortId}`;

        chrome.tabs.create({ url: youtubeUrl });
    }
});

"use strict";



//  P A C K A G E S


//  U T I L S

import relativeDate from "../modules/relative-date.js";


let githubFeed;
let lastGithubFeedUpdate;
updateGithubFeed();

// Update the feed every 5 minutes
setInterval(() => { updateGithubFeed(); }, 5 * 60 * 1000);

//  P R O G R A M

function generateEvent(event) {
  switch(event.type) {
    case "CommitCommentEvent":
      return `
        <strong><a
          href="${generateUrl("actor", event)}"
          rel="noopener noreferrer"
          target="_blank"
          title="Visit ${event.actor.login}'s profile on GitHub"
        >${event.actor.display_login}</a></strong> commented on

        <a
          href="${generateUrl("comment", event)}"
          target="_blank"
          title="View this comment on GitHub"
          rel="noopener noreferrer"
        >commit</a> in
      `;

    case "CreateEvent":
      return `
        <strong><a
          href="${generateUrl("actor", event)}"
          rel="noopener noreferrer"
          target="_blank"
          title="Visit ${event.actor.login}'s profile on GitHub"
        >${event.actor.display_login}</a></strong> created ${event.payload.ref_type}

        <code><a
          href="${generateUrl("create", event)}"
          rel="noopener noreferrer"
          target="_blank"
          title="View this branch on GitHub"
        >${refToBranch(event.payload.ref)}</a></code> in
      `;

    case "DeleteEvent":
      return `
        <strong><a
          href="${generateUrl("actor", event)}"
          rel="noopener noreferrer"
          target="_blank"
          title="Visit ${event.actor.login}'s profile on GitHub"
        >${event.actor.display_login}</a></strong> deleted

        ${event.payload.ref_type} <code>${event.payload.ref}</code> in
      `;

    case "ForkEvent":
      return `
        <strong><a
          href="${generateUrl("actor", event)}"
          rel="noopener noreferrer"
          target="_blank"
          title="Visit ${event.actor.login}'s profile on GitHub"
        >${event.actor.display_login}</a></strong> forked

        <strong><a
          href="${generateUrl("repo", event)}"
          rel="noopener noreferrer"
          target="_blank"
          title="View this repo on GitHub"
        >${event.repo.name}</a></strong> to

        <strong><a
          href="${generateUrl("forkee", event)}"
          rel="noopener noreferrer"
          target="_blank"
          title="View this repo fork on GitHub"
        >${event.payload.forkee.full_name}</a></strong>
      `;

    case "IssueCommentEvent":
      if (event.payload.issue.pull_request) {
        return `
          <strong><a
            href="${generateUrl("actor", event)}"
            rel="noopener noreferrer"
            target="_blank"
            title="Visit ${event.actor.login}'s profile on GitHub"
          >${event.actor.display_login}</a></strong> commented on pull request

          <em><a
            href="${generateUrl("issue", event)}"
            rel="noopener noreferrer"
            target="_blank"
            title="View this comment on GitHub"
          >${escapeSpecialCharacters(event.payload.issue.title)}</a></em> in
        `;
      } else {
        return `
          <strong>${event.actor.display_login}</strong> commented on issue

          <em><a
            href="${generateUrl("issue", event)}"
            rel="noopener noreferrer"
            target="_blank"
            title="View this comment on GitHub"
          >${escapeSpecialCharacters(event.payload.issue.title)}</a></em> in
        `;
      }

    case "IssuesEvent":
      return `
        <strong><a
          href="${generateUrl("actor", event)}"
          rel="noopener noreferrer"
          target="_blank"
          title="Visit ${event.actor.login}'s profile on GitHub"
        >${event.actor.display_login}</a></strong> ${event.payload.action} issue

        <em><a
          href="${generateUrl("issue", event)}"
          rel="noopener noreferrer"
          target="_blank"
          title="View this issue on GitHub"
        >${escapeSpecialCharacters(event.payload.issue.title)}</a></em> in
      `;

    case "PullRequestEvent":
      return `
        <strong><a
          href="${generateUrl("actor", event)}"
          rel="noopener noreferrer"
          target="_blank"
          title="Visit ${event.actor.login}'s profile on GitHub"
        >${event.actor.display_login}</a></strong> pull request

        <em><a
          href="${generateUrl("pull_request", event)}"
          rel="noopener noreferrer"
          target="_blank"
          title="View this pull request on GitHub"
        >${escapeSpecialCharacters(event.payload.pull_request.title)}</a></em> in
      `;
      
    case "PullRequestReviewEvent":
      return `
        <strong><a
          href="${generateUrl("actor", event)}"
          rel="noopener noreferrer"
          target="_blank"
          title="Visit ${event.actor.login}'s profile on GitHub"
        >${event.actor.display_login}</a></strong> reviewed pull request

        <em><a
          href="${generateUrl("pull_request", event)}"
          rel="noopener noreferrer"
          target="_blank"
          title="View this review on GitHub"
        >${escapeSpecialCharacters(event.payload.pull_request.title)}</a></em> in
      `;

    case "PullRequestReviewCommentEvent":
      return `
        <strong><a
          href="${generateUrl("actor", event)}"
          rel="noopener noreferrer"
          target="_blank"
          title="Visit ${event.actor.login}'s profile on GitHub"
        >${event.actor.display_login}</a></strong> commented on pull request

        <em><a
          href="${generateUrl("pull_request", event)}"
          rel="noopener noreferrer"
          target="_blank"
          title="View this comment on GitHub"
        >${escapeSpecialCharacters(event.payload.pull_request.title)}</a></em> in
      `;

    case "PushEvent":
      return `
        <strong><a
          href="${generateUrl("actor", event)}"
          rel="noopener noreferrer"
          target="_blank"
          title="Visit ${event.actor.login}'s profile on GitHub"
        >${event.actor.display_login}</a></strong> pushed to

        <code><a
          href="${generateUrl("push", event)}"
          rel="noopener noreferrer"
          target="_blank"
          title="View this branch on GitHub"
        >${refToBranch(event.payload.ref)}</a></code> in
      `;

    case "ReleaseEvent":
      return `
        <strong><a
          href="${generateUrl("actor", event)}"
          rel="noopener noreferrer"
          target="_blank"
          title="Visit ${event.actor.login}'s profile on GitHub"
        >${event.actor.display_login}</a></strong> released

        <em><a
          href="${generateUrl("release", event)}"
          title="View this release on GitHub"
          target="_blank"
          rel="noopener noreferrer"
        >${event.payload.release.tag_name}</a></em> in
      `;

    case "WatchEvent":
      return `
        <strong><a
          href="${generateUrl("actor", event)}"
          rel="noopener noreferrer"
          target="_blank"
          title="Visit ${event.actor.login}'s profile on GitHub"
        >${event.actor.display_login}</a></strong> starred the repo
      `;

    default:
      break;
  }
}

async function generateGitHubFeed(displayGitHubFeed) {
  await githubFeed;
  if (!githubFeed) return;

  const renderedEvents = [];

  for (const event of githubFeed) {
    const repoName = `
      <a href="${generateUrl("repo", event)}" title="View this repo on GitHub" target="_blank" rel="noopener noreferrer"><strong>${event.repo.name}</strong></a>
    `;

    renderedEvents.push(`
      <div class='github-feed__event'>
        <a href="${generateUrl("actor", event)}" target="_blank" rel="noopener noreferrer">
          <img src="${event.actor.avatar_url}" class="github-feed__event__avatar" alt="${event.actor.login}'s avatar"/>
        </a>

        <p>
          ${generateEvent(event)}
          ${event.type !== "ForkEvent" ? repoName : ""}
          <em class="github-feed__event__time">${relativeDate(new Date(event.created_at))}</em>
        </p>
      </div>
    `);
  }

  displayGitHubFeed(`
    <h3>GitHub</h3>
    <h5 class="last-updated">Last updated: ${lastGithubFeedUpdate.date} at ${lastGithubFeedUpdate.time} UTC</h5>

    ${renderedEvents.join("")}
  `);
}

function generateUrl(type, event) {
  switch(type) {
    case "actor":
      return `https://github.com/${event.actor.display_login}`;

    case "comment":
      return event.payload.comment.html_url;

    case "create":
      return `https://github.com/${event.repo.name}/tree/${event.payload.ref}`;

    case "forkee":
      return `https://github.com/${event.payload.forkee.full_name}`;

    case "issue":
      return event.payload.issue.html_url;

    case "pull_request":
      return event.payload.pull_request.html_url;

    case "push":
      return `https://github.com/${event.repo.name}/tree/${event.payload.ref.replace("refs/heads/", "")}`;

    case "release":
      return event.payload.release.html_url;

    case "repo":
      return `https://github.com/${event.repo.name}`;

    default:
      break;
  }
}

async function updateGithubFeed() {
  let response;

  try {
    response = await fetch(`https://api.github.com/orgs/lbryfoundation/events`, process.env.GITHUB_TOKEN && {
      headers: {
        'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`
      }
    });
  } catch (err) {
    console.log(err);
    return;
  }
  
  githubFeed = await response.json();
  const now = new Date();
  lastGithubFeedUpdate = {
    date: now.toISOString().split("T")[0],
    time: now.toLocaleTimeString('en-US', {
      timeZone: 'UTC'
    })
  };
}



//  H E L P E R

function escapeSpecialCharacters(contentToEscape) {
  const tagsToReplace = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;"
  };

  return contentToEscape.replace(/[&<>]/g, tag => tagsToReplace[tag] || tag);
}

function refToBranch(ref) {
  if (ref)
    return ref.replace("refs/heads/", "");
}



//  E X P O R T S

export {
  generateEvent,
  generateGitHubFeed,
  generateUrl,
  updateGithubFeed
};

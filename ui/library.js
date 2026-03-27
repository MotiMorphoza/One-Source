function createButton(label, className, onClick) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = className;
  button.textContent = label;
  button.addEventListener("click", onClick);
  return button;
}

function formatSourceLabel(topic) {
  const source = topic.source || "local";

  if (source === "hub") {
    return "Hub file";
  }

  if (source === "hub-copy") {
    return "Saved from hub";
  }

  if (source === "import") {
    return "Imported file";
  }

  return "Created locally";
}

function formatGameLabel(gameId) {
  const labels = {
    flashcards: "Flash Cards",
    wordmatch: "Word Match",
    wordpuzzle: "Word Puzzle",
  };

  return labels[gameId] || gameId;
}

export function renderLibraryTopics(mount, options = {}) {
  const {
    topics = [],
    onManage = () => {},
    onStart = () => {},
  } = options;

  mount.innerHTML = "";

  if (topics.length === 0) {
    const emptyState = document.createElement("div");
    emptyState.className = "empty-state";
    emptyState.textContent = "No lists are available for this selection yet.";
    mount.appendChild(emptyState);
    return;
  }

  topics.forEach((topic) => {
    const card = document.createElement("article");
    card.className = "library-topic-card";

    const titleRow = document.createElement("div");
    titleRow.className = "library-topic-card__title-row";

    const titleBlock = document.createElement("div");
    const title = document.createElement("h3");
    title.textContent = topic.name;
    const meta = document.createElement("p");
    meta.className = "support-text";
    const rowCount =
      typeof topic.rowsCount === "number"
        ? `${topic.rowsCount} rows`
        : topic.source === "hub"
          ? "Hub file"
          : "Rows unavailable";
    meta.textContent = `${topic.lang} | ${topic.topicName} | ${rowCount} | ${formatSourceLabel(topic)}`;
    titleBlock.append(title, meta);

    const count = document.createElement("span");
    count.className = "library-count-pill";
    count.textContent = typeof topic.rowsCount === "number" ? `${topic.rowsCount}` : "HUB";

    titleRow.append(titleBlock, count);

    const actionRow = document.createElement("div");
    actionRow.className = "library-topic-card__actions";
    actionRow.appendChild(
      createButton(
        topic.source === "hub" ? "Manage list" : "Edit list",
        "button button-secondary button-small",
        () => onManage(topic),
      ),
    );

    (topic.allowedGames || []).forEach((gameId) => {
      actionRow.appendChild(
        createButton(
          formatGameLabel(gameId),
          "button button-primary button-small",
          () => onStart(topic, gameId),
        ),
      );
    });

    card.append(titleRow, actionRow);
    mount.appendChild(card);
  });
}

export function renderLibraryRows(mount, options = {}) {
  const {
    rows = [],
    onEdit = () => {},
    onDelete = () => {},
  } = options;

  mount.innerHTML = "";

  if (rows.length === 0) {
    const emptyState = document.createElement("div");
    emptyState.className = "empty-state";
    emptyState.textContent = "This list has no rows yet.";
    mount.appendChild(emptyState);
    return;
  }

  rows.forEach((row, index) => {
    const card = document.createElement("article");
    card.className = "library-row-card";

    const values = document.createElement("div");
    values.className = "library-row-card__values";

    const source = document.createElement("p");
    source.className = "library-row-card__source";
    source.textContent = `${index + 1}. ${row.source}`;

    const target = document.createElement("p");
    target.className = "library-row-card__target";
    target.textContent = row.target;

    values.append(source, target);

    const actions = document.createElement("div");
    actions.className = "library-row-card__actions";
    actions.appendChild(
      createButton("Edit", "button button-secondary button-small", () => onEdit(row.id)),
    );
    actions.appendChild(
      createButton("Delete", "button button-danger button-small", () => onDelete(row.id)),
    );

    card.append(values, actions);
    mount.appendChild(card);
  });
}

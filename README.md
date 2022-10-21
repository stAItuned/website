# Documentation

## Table of contents

## Client Application Routes

### `/`

_This is the index route_

Homepage for guest users.

### `/meet`

This page shows a brief story about the brand.

### `/meet/:[team]`

_A page not found error is shown if not allowed param is passed._

`$page.params.team: "tech" | "marketing" | "writers"`

This page shows the list of members associated with the relative team.

### `/learn`

This page allows the user to select a target.

### `/learn/:[target]`

_A page not found error is shown if not allowed param is passed._

`$page.params.target: "newbie" | "expert"`

This page shows the posts associated with the relative target. Posts can be filtered by topic, creation date, reading time and languages and they can be searched by title and author.

### `/learn/:[target]/:[slug]`

_A page not found error is shown if not allowed param is passed._

`$page.params.target: "newbie" | "expert"`

`$page.params.slug: slug relative to a post`

Blog post page

### `/learn/keepintouch`

This page shows the contact form.

### `/*`

For any other route the application shows a page not found error.

---

## Server APIs

_There is no Server APIs at the moment._

---

## Database Structure

_There is no Database at the moment._

---

## Svelte Components APIs

### `UI core`

#### `Breadcrumb`

The component allows the user to navigate from a _sub-route_ to a _super-route_.

#### `Button`

The component renders a styled clickable button.

| Prop        | Type                          | Description                         | Default     | Required |
| ----------- | ----------------------------- | ----------------------------------- | ----------- | -------- |
| `variant`   | `"primary", "secondary"`      | Colors used for the button.         | `"primary"` | No       |
| `rounded`   | `"lg", "full"`                | Border radius of the button         | `"lg"`      | No       |
| `width`     | `"full", "fit"`               | Width of the button.                | `"fit"`     | No       |
| `type`      | `"button", "reset", "submit"` | Type of the button.                 | `"button"`  | No       |
| `onClick`   | `() => void`                  | Handle click fuction of the button. | `() => {}`  | No       |
| `className` | `string`                      | Classes of the button.              | `""`        | No       |

#### `Cards`

##### `Cards.Post`

| Prop      | Type      | Description                       | Default | Required |
| --------- | --------- | --------------------------------- | ------- | -------- |
| `article` | `Article` | The article that has to be shown. | _None_  | Yes      |

##### `Cards.Team`

| Prop     | Type     | Description                      | Default | Required |
| -------- | -------- | -------------------------------- | ------- | -------- |
| `author` | `Author` | The author that has to be shown. | _None_  | Yes      |

#### `Footer`

#### `Hamburger`

| Prop        | Type      | Description                     | Default | Required |
| ----------- | --------- | ------------------------------- | ------- | -------- |
| `open`      | `boolean` | Current state of the Hamburger. | _None_  | Yes      |
| `className` | `string`  | Classes of the Hamburger.       | `""`    | No       |

#### `Header`

| Prop          | Type      | Description                  | Default | Required |
| ------------- | --------- | ---------------------------- | ------- | -------- |
| `open_header` | `boolean` | Current state of the Header. | _None_  | Yes      |

#### `Nav`

| Prop      | Type         | Description                         | Default    | Required |
| --------- | ------------ | ----------------------------------- | ---------- | -------- |
| `onClick` | `() => void` | Handle click function of nav items. | `() => {}` | No       |

#### `Sidebars`

##### `Sidebars.Wrapper`

| Prop        | Type      | Description                   | Default | Required |
| ----------- | --------- | ----------------------------- | ------- | -------- |
| `open`      | `boolean` | Current state of the Sidebar. | _None_  | Yes      |
| `className` | `string`  | Classes of the Sidebar.       | `""`    | No       |

##### `Sidebars.Filters`

| Prop            | Type         | Description                   | Default | Required |
| --------------- | ------------ | ----------------------------- | ------- | -------- |
| `open`          | `boolean`    | Current state of the Sidebar. | _None_  | Yes      |
| `activeFilters` | `Filter`     | Filters currently active.     | _None_  | Yes      |
| `filter`        | `() => void` | Filter function.              | _None_  | Yes      |

##### `Sidebars.Header`

| Prop   | Type      | Description                   | Default | Required |
| ------ | --------- | ----------------------------- | ------- | -------- |
| `open` | `boolean` | Current state of the Sidebar. | _None_  | Yes      |

#### `TransitionPage`

### `Icons`

---

## Interfaces

---

## Configs

---

## Helpers

---

## Changelog

---

## Iusses

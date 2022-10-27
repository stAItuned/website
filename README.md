# Documentation

## Table of contents

## Client Application Routes

### `/`

_This is the index route_

Homepage for guest users. It shows the brand logo and a section where the most recent and the most relevant articles are shown.

The most relevant articles are set at configuration time from the corresponding config file.

See also [`Cards.Home` component API]() and [`Config.Home`]().

### `/meet`

This page shows a brief story about the brand and some cards to navigate to the team page.

The team cards are set at configuration time from the corresponding config file.

See also See also [`Cards.Team` component API]() and [`Config.Teams`]().

### `/meet/:[team]`

**A page not found error is shown if not allowed param is passed.**

```ts
$page.params.team: "tech" | "marketing" | "writers"
```

This page shows the list of members associated with the corresponding team, with their role in StAItuned and their contacts.

Some team members orders are set at configuration time from the corresponding config file.

See also See also [`Cards.TeamMember` component API]() and [`Config.Teams`]().

### `/learn`

This page allows the user to select a target, i.e. Newbie and Expert.

### `/learn/:[target]`

**A page not found error is shown if not allowed param is passed.**

```ts
$page.params.target: "newbie" | "expert"
```

Based on the selected target, this page shows the published articles.

Articles can be filtered by topic, creation date, reading time and languages and they also can be searched by title and author.

See also See also [`Cards.Post` component API]() and [`Config.Filters`]().

### `/learn/:[target]/:[slug]`

**A page not found error is shown if not allowed param is passed.**

```ts
$page.params.target: "newbie" | "expert"
$page.params.slug: // slug associated with an article
```

Based on the selected article, the `.md` file containing the article content is downloaded from the cms and the page shows the info and the article content.

### `/keepintouch`

This page shows a contact form and the user can send an email to the staff.

### `/*`

For any other route the application shows a page not found error.

## Server APIs

_There is no Server APIs at the moment._

## Database Structure

_There is no Database at the moment._

## Svelte Components APIs

### `UI core components APIs`

UI core module includes all the UI components used and the icons submodule.

#### `Breadcrumb`

The component allows the user to navigate from a _sub-route_ to a _super-route_, so that navigating between routes is simpler and smarter.

| Prop   | Type       | Description               | Default | Required |
| ------ | ---------- | ------------------------- | ------- | -------- |
| `tabs` | `string[]` | Array of breadcrumb tabs. | _None_  | Yes      |

See also See also [`utils` Helper]().

#### `Button`

The component renders a styled clickable button.

| Prop        | Type                                    | Description                         | Default     | Required |
| ----------- | --------------------------------------- | ----------------------------------- | ----------- | -------- |
| `variant`   | `"primary", "secondary", "transparent"` | Style variant used for the button.  | `"primary"` | No       |
| `rounded`   | `"lg", "full"`                          | Border radius of the button         | `"lg"`      | No       |
| `width`     | `"full", "fit"`                         | Width of the button.                | `"fit"`     | No       |
| `type`      | `"button", "reset", "submit"`           | Type of the button.                 | `"button"`  | No       |
| `onClick`   | `() => void`                            | Handle click fuction of the button. | `() => {}`  | No       |
| `className` | `string`                                | Classes of the button.              | `""`        | No       |

#### `CloseButton`

The component render a close icon and it can be used with a openable component to manage its current state, i.e. open or closed.

| Prop   | Type      | Description                              | Default | Required |
| ------ | --------- | ---------------------------------------- | ------- | -------- |
| `open` | `boolean` | Current state of the openable component. | _None_  | Yes      |

#### `Hamburger`

The component render an hamburger icon, that change based on the current state, and it can be used with a openable component to manage its current state, i.e. open or closed.

| Prop        | Type      | Description                              | Default | Required |
| ----------- | --------- | ---------------------------------------- | ------- | -------- |
| `open`      | `boolean` | Current state of the openable component. | _None_  | Yes      |
| `className` | `string`  | Classes of the Hamburger.                | `""`    | No       |

#### `Modal`

This submodule define all components useful to define a Modal.

##### `Modal.Dialog`

This component renders the modal itself, i.e. a block of content on top the page content.

| Prop     | Type      | Description                 | Default | Required |
| -------- | --------- | --------------------------- | ------- | -------- |
| `isOpen` | `boolean` | Current state of the modal. | _None_  | Yes      |

##### `Modal.Content`

This component renders the container for the content of the modal, with a title if it is set.

| Prop    | Type     | Description         | Default | Required |
| ------- | -------- | ------------------- | ------- | -------- |
| `title` | `string` | Title of the modal. | `""`    | No       |

##### `Modal.Actions`

This component renders the container of the call to actions of the modal.

| Prop    | Type     | Description         | Default | Required |
| ------- | -------- | ------------------- | ------- | -------- |
| `title` | `string` | Title of the modal. | `""`    | No       |

##### `Modal.Overlay`

This component renders the overlay of the modal, shown when the modal is open.

| Prop     | Type      | Description                 | Default | Required |
| -------- | --------- | --------------------------- | ------- | -------- |
| `isOpen` | `boolean` | Current state of the modal. | _None_  | Yes      |

#### `Nav`

This component renders a list a links to navigate between routes and it highlights the active one.

| Prop      | Type         | Description                         | Default    | Required |
| --------- | ------------ | ----------------------------------- | ---------- | -------- |
| `onClick` | `() => void` | Handle click function of nav items. | `() => {}` | No       |

#### `Searchbar`

This component renders a styled searchbar and you can set what it should do when its input value change.

| Prop           | Type                     | Description                                                                                     | Default    | Required |
| -------------- | ------------------------ | ----------------------------------------------------------------------------------------------- | ---------- | -------- |
| `inconStart`   | `boolean`                | It set the position of the search icon. If `true`, the icon is on the right of the input field. | `false`    | No       |
| `variant`      | `"solid", "transparent"` | Style used for the input field.                                                                 | `"solid"`  | No       |
| `name`         | `string`                 | Name of the input field.                                                                        | _None_     | Yes      |
| `placeholder`  | `string`                 | Placeholder of the input field.                                                                 | _None_     | Yes      |
| `handleInput`  | `(e: Event) => void`     | Function to execute on input event.                                                             | `() => {}` | No       |
| `handleChange` | `(e: Event) => void`     | Function to execute on change event.                                                            | `() => {}` | No       |

#### `Sidebar`

This component is a wrapper to define sidebars that are shown based on their current state.

| Prop        | Type         | Description                         | Default    | Required |
| ----------- | ------------ | ----------------------------------- | ---------- | -------- |
| `open`      | `boolean`    | Current state of the Sidebar.       | _None_     | Yes      |
| `onClose`   | `() => void` | Function to execute on close event. | `() => {}` | No       |
| `className` | `string`     | Classes of the Sidebar.             | `""`       | No       |

#### `TransitionPage`

This component is a wrapper that allows transition when the user navigate between routes.

### `Features components APIs`

Features module includes specific implementations of UI components used inside the website.

#### `Cards`

Cards submodule includes all the cards used.

##### `Cards.Home`

It renders the article card with the color overlay, used in the homepage.

| Prop      | Type      | Description                       | Default | Required |
| --------- | --------- | --------------------------------- | ------- | -------- |
| `article` | `Article` | The article that has to be shown. | _None_  | Yes      |
| `color`   | `string`  | The overlay color of the card.    | _None_  | Yes      |

##### `Cards.Post`

It renders the article post, used in the learn pages.

| Prop      | Type      | Description                       | Default | Required |
| --------- | --------- | --------------------------------- | ------- | -------- |
| `article` | `Article` | The article that has to be shown. | _None_  | Yes      |

##### `Cards.TeamMember`

It renders the info of a team member, used in the meet pages.

| Prop     | Type     | Description                      | Default | Required |
| -------- | -------- | -------------------------------- | ------- | -------- |
| `author` | `Author` | The member that has to be shown. | _None_  | Yes      |

##### `Cards.Team`

It renders the team card that allows to navigate to the specific team page, used in the meet pages.

| Prop   | Type   | Description                    | Default | Required |
| ------ | ------ | ------------------------------ | ------- | -------- |
| `team` | `Team` | The team that has to be shown. | _None_  | Yes      |

#### `Sidebars`

Sidebars submodule includes all the sidebars used.

##### `Sidebars.Filters`

Ir renders the filter sidebar, where the user can select params to filter the list of articles shown.

| Prop            | Type         | Description                   | Default | Required |
| --------------- | ------------ | ----------------------------- | ------- | -------- |
| `open`          | `boolean`    | Current state of the Sidebar. | _None_  | Yes      |
| `activeFilters` | `Filter`     | Filters currently active.     | _None_  | Yes      |
| `filter`        | `() => void` | Filter function.              | _None_  | Yes      |

##### `Sidebars.Header`

It renders the mobile main navigation component, included in the header.

| Prop   | Type      | Description                   | Default | Required |
| ------ | --------- | ----------------------------- | ------- | -------- |
| `open` | `boolean` | Current state of the Sidebar. | _None_  | Yes      |

#### `SearchModal`

Ir renders a modal where the user can search an article by title, included in the header.

| Prop     | Type      | Description                 | Default | Required |
| -------- | --------- | --------------------------- | ------- | -------- |
| `isOpen` | `boolean` | Current state of the Modal. | _None_  | Yes      |

### `Layouts`

#### `Header`

| Prop          | Type      | Description                  | Default | Required |
| ------------- | --------- | ---------------------------- | ------- | -------- |
| `open_header` | `boolean` | Current state of the Header. | _None_  | Yes      |

### `Icons`

## Configs

## Types

## Interfaces

Here a list of the interfaces implemented.

### Interfaces for articles

#### `Cover`

This interface is useful to associate each cover image, dynamically imported, with the corresponding article.

```ts
export interface Cover {
	image: string // cover image, dynamically imported
	article: string // slug of the corresponding article
}
```

#### `ArticleMetadata`

This interface defines all the information associated with an article as metadata.

```ts
export interface ArticleMetadata {
	title: string // title of the article
	author: string // name of the author of the article
	date: string // publication date
	topics: string[] // list of tags, e.g. Basic, Machine Learning, ...
	meta: string // brief introduction or description
	target: string // users target, e.g. Newbie or Expert
	cover: string // cover image
	language: string // language, e.g. Italian or English
	readingTime: number // reading time in minutes
}
```

#### `Article`

This interface defines an artile.

```ts
export interface Article {
	slug: string // folder where the post is in the cms (used as an id)
	filename: string // name of the content file (.md file)
	metadata: ArticleMetadata // metadata of the article
	author?: Author | undefined // author with all its info
}
```

### Interfaces for authors

#### `Author`

This interface defines an author.

```ts
interface Author {
	name: string // name of the author
	team: string[] // list of teams to which he belongs
	title: string // role
	linkedin: string // LinkedIn profile url
	email: string // contact email address
	description: string // a brief introduction
	propic: string // path to the propic
}
```

### Interfaces for CMS data

#### `CMSData`

This interface defines the CMS data.

```ts
interface CMSData {
	articles: Article[] // list of articles
	authors: Author[] // list of authors
}
```

### Interfaces for filters

#### `Filter`

This interface defines the filter for articles.

```ts
export default interface Filter {
    tags: Tag[], // list of tags
    creationDate: CreationDate, // publication date range
    readingTime: ReadingTime[], // list of reading time ranges
    languages: Language[], // list of languages
    searchParam: string, // searching for this string
}
```

## Helpers

## Changelog

## Iusses

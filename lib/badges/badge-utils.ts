export const AVAILABLE_BADGE_ICONS = [
    'contributor',
    'bronze-writer',
    'silver-writer',
    'gold-writer'
];

export function getBadgeImageSource(iconName: string) {
    if (AVAILABLE_BADGE_ICONS.includes(iconName)) {
        return `/badges/${iconName}.png`;
    }
    return '/badges/contributor.png';
}

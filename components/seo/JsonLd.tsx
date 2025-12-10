/**
 * JsonLd Component
 * 
 * Renders JSON-LD structured data in a script tag.
 * Used for SEO structured data (Schema.org).
 */

interface JsonLdProps {
    /** The structured data object to render */
    data: Record<string, unknown>
    /** Optional ID for the script element */
    id?: string
}

/**
 * Renders JSON-LD structured data as a script tag
 * 
 * @example
 * import { generateOrganizationSchema } from '@/lib/seo/seo-schemas'
 * 
 * <JsonLd data={generateOrganizationSchema()} />
 */
export function JsonLd({ data, id }: JsonLdProps) {
    return (
        <script
            id={id}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data, null, 0) }}
        />
    )
}

/**
 * Renders multiple JSON-LD schemas in separate script tags
 */
export function JsonLdMultiple({ schemas }: { schemas: Record<string, unknown>[] }) {
    return (
        <>
            {schemas.map((schema, index) => (
                <JsonLd key={index} data={schema} id={`json-ld-${index}`} />
            ))}
        </>
    )
}

export default JsonLd

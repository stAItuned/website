Regulatory Analysis: Article 25 and the Allocation of Liability in the AI Value Chain

1. Strategic Context of the AI Act Value Chain

The EU Artificial Intelligence Act (Regulation 2024/1689) operates through a "risk-based approach," but the stability of this framework relies on a dynamic allocation of responsibility. Article 25 serves as the primary mechanism ensuring that regulatory accountability follows functional control rather than merely original manufacturing. By shifting provider status to downstream actors who modify or rebrand systems, the Act prevents "regulatory gaps" where the entity exercising actual control over a system’s risk profile might otherwise evade the high-friction obligations of a "Provider."

Correctly identifying stakeholder roles is a critical strategic requirement, as misidentification creates a significant "regulatory risk" of unfulfilled obligations. Per the definitions established in the Act:

* Providers: Natural or legal persons who develop an AI system (or have one developed) and place it on the market or put it into service under their own name or trademark.
* Deployers: Entities using an AI system under their authority in a professional context (excluding personal, non-professional use).
* Importers: EU-based entities that place an AI system from a third country on the Union market, ensuring it bears the required conformity mark and is accompanied by the requisite documentation.
* Distributors: Actors in the supply chain (other than providers or importers) who make a system available on the market, similarly verifying the presence of conformity marks and documentation.

The following analysis details the specific legal triggers and contractual mandates that cause a shift in these regulatory roles.


--------------------------------------------------------------------------------


2. Legal Triggers for the Re-assignment of Provider Liability (Article 25.1 & 25.3)

Article 25(1) establishes the "deemed provider" status to ensure that the party with the most direct influence over a high-risk system's final form is held accountable. This prevents entities from circumventing Article 16 obligations by simply modifying or rebranding existing systems.

Under Article 25.1, a distributor, importer, deployer, or other third party is "deemed" a provider—assuming full liability—under the following circumstances:

* Trademarks and Rebranding (Art 25.1.a): Placing a name or trademark on a high-risk system already on the market. Crucially, this occurs without prejudice to contractual arrangements stipulating that obligations are otherwise allocated—a vital detail for counsel seeking to manage liability through indemnity or service-level agreements.
* Substantial Modification (Art 25.1.b): Making changes to a high-risk system that significantly alter its nature or risk profile.
* Purpose Modification (Art 25.1.c): Changing the intended purpose of a non-high-risk system (including a General-Purpose AI model) so that it now qualifies as high-risk.

The GPAI Modification Threshold
For downstream modifiers of General-Purpose AI (GPAI) models, a specific technical trigger exists: an entity is deemed a provider if they modify a model using compute power exceeding one-third (1/3) of that used for the original model's training.

Product Manufacturers (Article 25.3)
Counsel must also account for Article 25(3), which dictates that if a high-risk AI system is a safety component of a product covered by Annex I harmonisation legislation (e.g., machinery, toys, medical devices) and is placed on the market under the product manufacturer's name, the manufacturer is considered the Provider.

The "So What?" Factor
Pulling these triggers subjects the entity to the full suite of Article 16 Obligations. This is a massive operational burden, requiring the implementation of a Quality Management System (Art 17), Technical Documentation (Art 18), ensuring the CE Marking is applied (Art 48), and registering the system in the EU Database (Art 71). Failure to execute these transitions creates immediate exposure to market surveillance enforcement.


--------------------------------------------------------------------------------


3. Inter-Operator Cooperation and the Technical Access Mandate

When an entity becomes a "new provider" under Article 25.1, they face an operational dependency on the "initial provider" for technical data. Article 25.2 creates a mandatory requirement for inter-operator cooperation to facilitate this transition.

The initial provider is subject to the following duties:

* Duty to Cooperate: Closely working with the new provider to fulfill AI Act obligations.
* Information Disclosure: Making necessary information available to enable compliance.
* Technical Access: Providing the reasonably expected technical access and assistance required for the new provider to perform mandatory conformity assessments.

The "Opt-Out" Exception
This duty is not absolute. If the initial provider has explicitly and clearly specified that their AI system is not to be converted into a high-risk system, they are specifically exempt from the obligation to hand over technical documentation or provide assistance for such a conversion. This serves as a critical "shield" for upstream developers who wish to limit their liability to low-risk use cases.


--------------------------------------------------------------------------------


4. Mandatory Written Agreements for Component and Tool Suppliers (Article 25.4)

Article 25(4) manages "upstream" supply chain risks by mandating transparency between high-risk AI providers and their suppliers. High-risk providers cannot be left solely responsible for risks inherent in integrated third-party tools.

All integrations of third-party AI systems, tools, services, or components must be governed by a Written Agreement specifying:

* Necessary information and capabilities of the component.
* Detailed technical access requirements.
* Adherence to the "generally acknowledged state of the art."

The GPAI and FOSS Nuance
While a general exemption exists for tools or components provided under Free and Open-Source (FOSS) licenses, this exemption does not apply to GPAI models. Providers of GPAI models must still comply with transparency (Art 53) and systemic risk (Art 55) duties. The AI Office will facilitate this through the Code of Practice, a tool for GPAI providers to demonstrate conformity.

Contractual Balance (Article 25.5)
The AI Office is tasked with developing "voluntary model terms" to reduce the administrative burden of these contracts. However, Article 25.5 explicitly states that all cooperation and contractual mandates are "without prejudice to the need to observe and protect intellectual property (IP) rights and trade secrets." Counsel must ensure that "Technical Access Mandates" are drafted to provide sufficient compliance evidence without triggering the involuntary disclosure of proprietary trade secrets.


--------------------------------------------------------------------------------


5. Regulatory Enforcement, Penalties, and Risk Mitigation

Article 25 transitions effectively move an organization from "Deployer" scrutiny to the significantly higher "Provider" penalty regime.

Violation Type	Maximum Administrative Fine
Non-compliance with Prohibited AI Practices (Article 5)	€35M or 7% of total worldwide annual turnover
Non-compliance with Article 16 Obligations (Provider Status)	€15M or 3% of total worldwide annual turnover
Supply of false, incomplete, or misleading information	€7.5M or 1% of total worldwide annual turnover

Note: For SMEs and startups, the fine is the lower of the absolute amount or the percentage of turnover (Art 99.6).

Strategic Recommendations for Legal Counsel

1. Audit of Modifications: Implement internal "change control" systems to track modifications. If compute power for a GPAI modification approaches the 1/3 threshold, or if a change alters the intended purpose, immediate "Provider-readiness" protocols must be triggered.
2. Contractual Hardening: Until the AI Office releases voluntary model terms, counsel must manually draft "Technical Access Mandates" into all procurement contracts, ensuring suppliers are legally bound to provide the data necessary for conformity assessments.
3. Documentation Repositories: Maintain centralized model inventories and technical files. These are the primary defense in a market surveillance audit to demonstrate adherence to the "state of the art."

Conclusion: The Necessity of AI Literacy
Under Article 4, AI Literacy is a foundational requirement. Organizations must ensure that staff—particularly those in procurement and software development—understand the legal triggers of Article 25. AI Literacy serves as the "defense-in-depth" against accidental provider status, ensuring that a "substantial modification" does not occur without the organization's full awareness of the resulting liability shift.

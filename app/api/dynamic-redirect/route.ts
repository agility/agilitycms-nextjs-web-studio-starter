import { getDynamicPageURL } from "@agility/nextjs/node";
import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { draftMode } from "next/headers"

export async function GET(req: NextRequest, res: NextResponse) {

	const contentIDStr = req.nextUrl.searchParams.get("contentID") as string
	const contentID = parseInt(contentIDStr)

	const preview = draftMode().isEnabled

	if (!isNaN(contentID) && contentID > 0) {
		//*** this is a dynamic page request ***
		//get the slug for this page based on the sitemap and redirect there
		const redirectUrl = await getDynamicPageURL({ contentID, preview, slug: "" })
		if (redirectUrl) {
			console.log("Dynamic Page URL", { contentID, redirectUrl })
			return NextResponse.redirect(redirectUrl)
		}
	}

	console.log("NO Dynamic Page URL for content id", { contentID })

	//if we get here, it's a 404
	return new Response(`Not Found`, {
		status: 404
	})

}
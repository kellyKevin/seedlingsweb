import asyncio
from playwright.async_api import async_playwright
import os

async def run_verification():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        context = await browser.new_context(record_video_dir="verification/videos/")
        page = await context.new_page()

        # Go to the local server
        try:
            await page.goto("http://localhost:8000/new.html")
            print("Successfully loaded new.html")

            # Take a screenshot of the products page
            await page.screenshot(path="verification/products_page_final.png")
            print("Took screenshot: verification/products_page_final.png")

            # Go to cart page
            await page.goto("http://localhost:8000/cart.html")
            print("Successfully loaded cart.html")
            await page.screenshot(path="verification/cart_page_final.png")
            print("Took screenshot: verification/cart_page_final.png")

        except Exception as e:
            print(f"Error during verification: {e}")

        await context.close()
        await browser.close()

if __name__ == "__main__":
    if not os.path.exists("verification"):
        os.makedirs("verification")
    asyncio.run(run_verification())

import asyncio
from playwright.async_api import async_playwright
import os

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        # Use port 3001 as we started the server there
        page = await browser.new_page(viewport={'width': 1280, 'height': 800})

        try:
            await page.goto('http://localhost:3001', wait_until='networkidle')

            # 1. Capture Divine Path
            print("Switching to Divine Path...")
            await page.click('text=DIVINE PATH')
            await asyncio.sleep(2)
            await page.screenshot(path='/home/jules/verification/divine_path.png')

            # 2. Capture Sanctum Response
            print("Switching back to Sanctum...")
            await page.click('text=SANCTUM')
            await asyncio.sleep(1)

            print("Sending query...")
            await page.fill('textarea[placeholder="Whisper your quest..."]', 'Who is Hanuman?')
            await page.click('text=ASK THE SAGE')

            # Wait for response and revelation
            print("Waiting for Sage revelation...")
            # Revelation sections reveal sequentially, total might take ~15-20s,
            # but we can check if the first one appears.
            await page.wait_for_selector('text=Reflection', timeout=30000)
            await asyncio.sleep(10) # Wait a bit more for more sections to reveal
            await page.screenshot(path='/home/jules/verification/sanctum_response.png')

            print("Screenshots captured successfully.")

        except Exception as e:
            print(f"Error: {e}")
            await page.screenshot(path='/home/jules/verification/error.png')
        finally:
            await browser.close()

asyncio.run(run())

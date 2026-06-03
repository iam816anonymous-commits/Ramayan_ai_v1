
from playwright.sync_api import sync_playwright
import os
import time

def run_validation():
    output_dir = '/home/jules/ux_validation'
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Desktop
        page = browser.new_page(viewport={'width': 1920, 'height': 1080})

        print('Navigating to Sanctum...')
        page.goto('http://localhost:3001', wait_until='networkidle')
        time.sleep(3) # Allow animations to settle

        # 1. Temple Gate
        print('Capturing Temple Gate...')
        page.screenshot(path=os.path.join(output_dir, '01_temple_gate.png'))

        # 2. Sacred Courtyard
        print('Scrolling to Sacred Courtyard...')
        page.locator('#courtyard').scroll_into_view_if_needed()
        time.sleep(2)
        page.screenshot(path=os.path.join(output_dir, '02_sacred_courtyard.png'))

        # 3. Journey Through Ramayana
        print('Scrolling to Journey...')
        page.locator('#journey').scroll_into_view_if_needed()
        time.sleep(2)
        page.screenshot(path=os.path.join(output_dir, '03_journey_ramayana.png'))

        # 4. Hall of Heroes
        print('Scrolling to Hall of Heroes...')
        page.locator('#heroes').scroll_into_view_if_needed()
        time.sleep(2)
        page.screenshot(path=os.path.join(output_dir, '04_hall_of_heroes.png'))

        # 5. Wisdom Archive
        print('Scrolling to Wisdom Archive...')
        page.locator('#archive').scroll_into_view_if_needed()
        time.sleep(2)
        page.screenshot(path=os.path.join(output_dir, '05_wisdom_archive.png'))

        # 6. Dharma Gallery
        print('Scrolling to Dharma Gallery...')
        page.locator('#dharma').scroll_into_view_if_needed()
        time.sleep(2)
        page.screenshot(path=os.path.join(output_dir, '06_dharma_gallery.png'))

        # 7. Inquiry Hall
        print('Scrolling to Inquiry Hall...')
        page.locator('#inquiry').scroll_into_view_if_needed()
        time.sleep(2)
        page.screenshot(path=os.path.join(output_dir, '07_inquiry_hall.png'))

        # 8. Inner Sanctum Response
        print('Interacting with the Sage...')
        # The selector was wrong, it's a textarea
        input_field = page.locator('textarea[placeholder*="wisdom do you seek"]')
        input_field.fill('What is the duty of Rama?')
        input_field.press('Enter')

        print('Waiting for revelation...')
        # Wait for the takeaway to appear (last stage of revelation)
        time.sleep(15)
        page.screenshot(path=os.path.join(output_dir, '08_inner_sanctum_response.png'))

        # Mobile Review
        print('Performing Mobile Review...')
        mobile_page = browser.new_page(viewport={'width': 390, 'height': 844})
        mobile_page.goto('http://localhost:3001', wait_until='networkidle')
        time.sleep(3)
        mobile_page.screenshot(path=os.path.join(output_dir, '09_mobile_gate.png'))

        mobile_page.locator('#heroes').scroll_into_view_if_needed()
        time.sleep(2)
        mobile_page.screenshot(path=os.path.join(output_dir, '10_mobile_heroes.png'))

        browser.close()

if __name__ == '__main__':
    run_validation()

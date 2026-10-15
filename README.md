# Call List 828

A static Buncombe County / Asheville trades directory. Local recommendations named on r/asheville, with phone numbers copied from official sites only. Updated monthly.

## Open the site

No build step.

1. Clone or download this repo.
2. Open the homepage in a browser (double-click the file, or drag it onto a window).
3. Shops load from `js/shops-data.js`, so a file open works. `data/shops.json` is the same list for editing.

If you prefer a local server:

```bash
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

## What’s in here

| File | Role |
| --- | --- |
| `index.html` | Directory, filters, detail drawer, tip form |
| `css/app.css` | Layout and print-shop styling |
| `js/app.js` | Filters, drawer, tips |
| `js/shops-data.js` | Embedded shop records for `file://` |
| `data/shops.json` | Same records, easier to edit |

## Filters

- **Trade:** HVAC, electrical, plumbing, auto
- **Ownership:** family, employee-owned (ESOP)
- **Tags:** heat pump, old house, knob-and-tube, older cars, mobile

Cards show a dated Reddit quote and permalink when one was captured. Shops without a quote omit the block. The drawer has call, official site, map, Google reviews, and NC license lookup. No invented review text.

## Skip this window

All About Heat & Air, All Seasons Heating & Air, and A-American Electric are marked **skip this window**. They are the first names people call and are often already booked. Use the other cards if you need work this week.

## Tips

The on-page form is labeled **Leave a tip**. The shop list includes **Other**, and the button is **Submit**.

## Sources

Checked 15 Oct 2026 against official sites and these r/asheville threads:

- [Which HVAC company do you recommend for new install in an old house?](https://www.reddit.com/r/asheville/comments/1w2y78o/) (31 Aug 2026)
- [HVAC Maintenance and repairs serving South Asheville](https://www.reddit.com/r/asheville/comments/1vcwskk/) (6 Aug 2026)
- [Central A/C replacement. Trane?](https://www.reddit.com/r/asheville/comments/1vlgnrn/) (14 Aug 2026)
- [Mechanic Needed - Mom and Pop/Community-Driven](https://www.reddit.com/r/asheville/comments/1vmqmsx/) (14 Aug 2026)
- [HVAC recommendations? who is good and who should be avoided?](https://www.reddit.com/r/asheville/comments/1v0sk2j/) (19 Jul 2026)
- [Looking for an independent mechanic reccomendation](https://www.reddit.com/r/asheville/comments/1ulghwe/) (3 Jul 2026)
- [What is the best, honest and trustworthy mechanic in Asheville?](https://www.reddit.com/r/asheville/comments/1rom7z0/) (9 Mar 2026)
- [Electrician Recommendations for upgrade](https://www.reddit.com/r/asheville/comments/1pi3f2n/) (9 Dec 2025)
- [Fair HVAC Inspection/Service Company?](https://www.reddit.com/r/asheville/comments/1ned5zb/) (11 Sep 2025)
- [Looking for a plumber recommendation](https://www.reddit.com/r/asheville/comments/1mquv4o/) (15 Aug 2025)
- [Power to the People](https://www.reddit.com/r/asheville/comments/1tpeeu5/) (28 May 2026; older quote, kept because the shop is the knob-and-tube specialist)

License lookups:

- HVAC / plumbing: https://public.nclicensing.org/Public/Search
- Electrical: https://www.ncbeec.org/

This is a neighbor list, not an endorsement, and not a substitute for checking a license yourself.

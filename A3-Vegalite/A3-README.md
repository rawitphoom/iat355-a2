IAT355 – Assignment 3: Vega-Lite Visualizations

Overview

This project explores global video game sales data using Vega-Lite. The dataset includes information on platforms, genres, publishers, and regional sales (North America, Europe, Japan, and Other).
The goal is to visualize patterns and trends in the data through multiple visualizations and reflect on the insights discovered.

There are four main visualizations in this project each addressing one of the assignment prompts.

Visualization A - Global Sales by Genre and Platform

File: videogames_wide.csv
Chart Type: Stacked Bar Chart

Description:
This visualization shows how different platforms contribute to each genre’s global sales.
Action and Sports genres dominate overall. Nintendo platforms such as Wii and DS, and Sony’s PlayStation consoles, account for the majority of sales.
PC maintains steady performance across several genres, indicating a consistent but smaller market presence.

Visualization B - Sales Over Time by Platform and Genre

File: videogames_wide.csv
Chart Type: Faceted Line Chart (2000–2016)

Description:
This visualization explores sales trends over time, focusing on the relationship between platform and genre.
PlayStation 2 and PlayStation 3 dominate the mid-2000s, particularly in Action and Role-Playing genres.
The Wii shows a noticeable spike around 2008 for family-oriented titles.
After 2010, overall sales across all platforms show a steady decline as the market transitions to newer consoles.

Visualization C - Regional Sales vs Platform

File: videogames_wide.csv
Chart Type: Grouped Bar Chart

Description:
This visualization compares regional sales (North America, Europe, Japan, and Other) across various gaming platforms.
North America and Europe lead in overall sales for most platforms, while Japan shows a strong preference for Nintendo and PlayStation consoles.
Xbox performs significantly better in Western regions compared to Japan.

Visualization D - Japanese Sales Trends by Genre (2000–2020)

File: videogames_long.csv
Chart Type: Multi-Line Chart

Description:
This visualization focuses on Japan’s market trends over time, highlighting regional preferences by genre.
Nintendo titles perform strongly, especially in the Action and Role-Playing genres.
Handheld systems such as the DS, 3DS, and Switch dominate after 2005, while Western consoles like Xbox show low sales throughout the period.

Tools and Methods

Vega-Lite v5 (CDN)

JavaScript, HTML, and CSS

Datasets: videogames_wide.csv and videogames_long.csv
# Product Swap App

This is a product swap app that allows users to upload products, swap them with other users, and create offers for swaps with a monetary exchange. The app includes the following features:

## OAuth2 and Refresh Tokens

The app uses OAuth2 for user authentication and authorization. Users can log in using their preferred OAuth2 provider. The app also supports refresh tokens, allowing users to obtain a new access token without re-authenticating.

## Access Tokens

Access tokens are used to authenticate and authorize requests to the API endpoints. The app generates access tokens with a specific lifetime and verifies them on every request.

## Redis for Cache

The app uses Redis as a caching layer to improve performance. It stores frequently accessed data in Redis to reduce database queries.

## Images Upload

Users can upload images of their products. The app stores the images in a storage database and provides a link to the uploaded image.

## MySQL Database

The app uses a MySQL database to store product and user information. It stores the product details, user profiles, and swap offers in the database.

## Product Upload

Users can upload their products to the app. They can provide details such as the product name, description, and price.

## Product Swap

Users can swap their products with other users. They can create offers for swaps with a monetary exchange, which can be either negative or positive. Users can reject, accept, or counter offers.

## Offers

Users can create, view, and manage offers for product swaps. They can see the details of the offer, including the product being swapped, the exchange amount, and the status of the offer.

## Rejection, Acceptance, and Countering

Users can reject, accept, or counter offers for product swaps. They can communicate with other users to negotiate the terms of the swap.

## Installation

To install and run the app locally, follow these steps:


1. Install dependencies: `npm install`
2. Create a MySQL database and update the database configuration in the `.env` file.
3. Start the app: `npm start`

## Usage

Once the app is running, you can access it at `http://localhost:${port}`. Users can sign up, log in, and start using the app to upload products, swap them with other users, and create offers.

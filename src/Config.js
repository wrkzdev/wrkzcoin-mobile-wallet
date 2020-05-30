// Copyright (C) 2018, Zpalmtree
//
// Please see the included LICENSE file for more information.

import { Platform } from 'react-native';

import { MixinLimit, MixinLimits, Daemon } from 'turtlecoin-wallet-backend';

import {
    derivePublicKey, generateKeyDerivation, generateRingSignatures,
    deriveSecretKey, generateKeyImage, checkRingSignature,
} from './NativeCode';

const Config = new function() {
    /**
     * If you can't figure this one out, I don't have high hopes
     */
    this.coinName = 'BitcoinMono';

    /**
     * Prefix for URI encoded addresses
     */
    this.uriPrefix = 'bitcoinmono://';

    /**
     * How often to save the wallet, in milliseconds
     */
    this.walletSaveFrequency = 60 * 1000;

    /**
     * The amount of decimal places your coin has, e.g. TurtleCoin has two
     * decimals
     */
    this.decimalPlaces = 4;

    /**
     * The address prefix your coin uses - you can find this in CryptoNoteConfig.h.
     * In TurtleCoin, this converts to Wrkz
     */
    this.addressPrefix = 3771344;

    /**
     * Request timeout for daemon operations in milliseconds
     */
    this.requestTimeout = 10 * 1000;

    /**
     * The block time of your coin, in seconds
     */
    this.blockTargetTime = 50;

    /**
     * How often to process blocks, in millseconds
     */
    this.syncThreadInterval = 4;

    /**
     * How often to update the daemon info, in milliseconds
     */
    this.daemonUpdateInterval = 10 * 1000;

    /**
     * How often to check on locked transactions
     */
    this.lockedTransactionsCheckInterval = 10 * 3000;

    /**
     * The amount of blocks to process per 'tick' of the mainloop. Note: too
     * high a value will cause the event loop to be blocked, and your interaction
     * to be laggy.
     */
    this.blocksPerTick = 100;

    /**
     * Your coins 'ticker', generally used to refer to the coin, i.e. 123 TRTL
     */
    this.ticker = 'BTCMZ';

    /**
     * Most people haven't mined any blocks, so lets not waste time scanning
     * them
     */
    this.scanCoinbaseTransactions = false;

    /**
     * The minimum fee allowed for transactions, in ATOMIC units
     */
    this.minimumFee = 5000000;

    /**
     * Fee per byte height
     */
    this.feePerByteHeight = 650000;

    /**
     * Mapping of height to mixin maximum and mixin minimum
     */
    this.mixinLimits = new MixinLimits([
        /* Height: 10,000, minMixin: 0, maxMixin: 30, defaultMixin: 3 */
        new MixinLimit(0, 0, 7, 1),

        /* At height of 250,000 */
        new MixinLimit(250000, 0, 3, 1),

    ], 1 /* Default mixin of 3 before block 10,000 */);

    /**
     * The length of a standard address for your coin
     */
    this.standardAddressLength = 99;

    /**
     * The length of an integrated address for your coin - It's the same as
     * a normal address, but there is a paymentID included in there - since
     * payment ID's are 64 chars, and base58 encoding is done by encoding
     * chunks of 8 chars at once into blocks of 11 chars, we can calculate
     * this automatically
     */
    this.integratedAddressLength = 99 + ((64 * 11) / 8);

    /**
     * Use our native func instead of JS slowness
     */
    this.derivePublicKey = Platform.OS === 'ios' ? undefined : derivePublicKey;

    /**
     * Use our native func instead of JS slowness
     */
    this.generateKeyDerivation = Platform.OS === 'ios' ? undefined : generateKeyDerivation;

    /**
     * Use our native func instead of JS slowness
     */
    this.generateRingSignatures = Platform.OS === 'ios' ? undefined : generateRingSignatures;

    /**
     * Use our native func instead of JS slowness
     */
    this.deriveSecretKey = Platform.OS === 'ios' ? undefined : deriveSecretKey;

    /**
     * Use our native func instead of JS slowness
     */
    this.generateKeyImage = Platform.OS === 'ios' ? undefined : generateKeyImage;

    /**
     * Use our native func instead of JS slowness
     */
    this.checkRingSignatures = Platform.OS === 'ios' ? undefined: checkRingSignature;

    /**
     * Memory to use for storing downloaded blocks - 32MB
     */
    this.blockStoreMemoryLimit = 1024 * 1024 * 32;

    /**
     * Amount of blocks to request from the daemon at once
     */
    this.blocksPerDaemonRequest = 100;

    /**
     * Unix timestamp of the time your chain was launched.
     *
     * Note - you may want to manually adjust this. Take the current timestamp,
     * take away the launch timestamp, divide by block time, and that value
     * should be equal to your current block count. If it's significantly different,
     * you can offset your timestamp to fix the discrepancy
     */
    this.chainLaunchTimestamp = new Date(1000 * 1529831318);

    /**
     * Fee to take on all transactions, in percentage
     */
    this.devFeePercentage = 1.0;

    /**
     * Address to send dev fee to
     */
    this.devFeeAddress = 'btcmzTHkHtyhMoh8rjKgfvD13yFhs4eMmVBbuRcBMBZLdK67HCFbc4LegfEggApq8R2JJo8198vc4SwRjytTEbFZVvz6AyEUkuP';

    /**
     * Base url for price API
     *
     * The program *should* fail gracefully if your coin is not supported, or
     * you just set this to an empty string. If you have another API you want
     * it to support, you're going to have to modify the code in Currency.js.
     */
    this.priceApiLink = 'https://api.coingecko.com/api/v3/simple/price';

    /**
     * Default daemon to use. Can either be a BlockchainCacheApi(baseURL, SSL),
     * or a ConventionalDaemon(url, port).
     */
    this.defaultDaemon = new Daemon('btcmz.bot.tips', 443);

    /**
     * A link to where a bug can be reported for your wallet. Please update
     * this if you are forking, so we don't get reported bugs for your wallet...
     *
     */
    this.repoLink = 'https://github.com/bitcoinmono/bitcoinmono/issues';

    /**
     * This only controls the name in the settings screen.
     */
    this.appName = 'BitMono';

    /**
     * Slogan phrase during wallet CreateScreen
     */
    this.sloganCreateScreen = 'Your BTCMZ Mobile Wallet!';

    /**
     * Displayed in the settings screen
     */
    this.appVersion = 'v1.2.1';

    /**
     * Base URL for us to chuck a hash on the end, and find a transaction
     */
    this.explorerBaseURL = 'https://explorer.bitcoinmono.io/transaction.html?hash=';

    /**
     * A link to your app on the Apple app store. Currently blank because we
     * haven't released for iOS yet...
     */
    this.appStoreLink = '';

    /**
     * A link to your app on the google play store
     */
    this.googlePlayLink = 'https://play.google.com/store/apps/details?id=tips.bot.btcmzmobile';

    /**
     * A url to fetch node info from. Should follow the turtlepay format 
     * detailed here: https://docs.turtlepay.io/blockapi/
     */
    this.nodeListURL = 'http://btcmz-nodes.bot.tips/list';
};

module.exports = Config;

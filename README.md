# PHP Copy Reference
[![Latest Release](https://vsmarketplacebadge.apphb.com/version-short/MDOQ.phpcopyreference.svg)](https://marketplace.visualstudio.com/items?itemName=MDOQ.phpcopyreference)
[![Installs](https://img.shields.io/vscode-marketplace/d/MDOQ.phpcopyreference.svg)](https://marketplace.visualstudio.com/items?itemName=MDOQ.phpcopyreference)[![Rating](https://vsmarketplacebadge.apphb.com/rating-short/MDOQ.phpcopyreference.svg)](https://marketplace.visualstudio.com/items?itemName=MDOQ.phpcopyreference#review-details)

This extension adds the "Copy Reference" item to the editor context menu.
The refence is copied to the users clipboard.

## Features
![Copy Reference](https://github.com/MDOQ-UK/vscode-extension-php-copy-reference/blob/main/assets/phpcopyreference.gif?raw=true)

## Requirements

You need a PHP language server extension installed such as:
- [PHP IntelliSense](https://marketplace.visualstudio.com/items?itemName=felixfbecker.php-intellisense)
- [PHP Intelephense](https://marketplace.visualstudio.com/items?itemName=bmewburn.vscode-intelephense-client)

## Extension Settings
No settings at present.

## Known Issues

### Unable to copy embeded reference
Example code
`A.php`
```php
Class A {
    const FOO = 'bar';
}
```
`B.php`
```php
Class B {
    public function anything()
    {
        $variable = \A::FOO;
    }
}
```
In this example:
- You **can** select `FOO` within class `A` and get a the reference: `\A::FOO`
- You **can't** select `FOO` within class `B`, as `\A::FOO` isn't returned as a Symbol within the document.

### Reference is to file not to symbol
If you select a valid symbol within the document, but the reference is a file path. This may be because the language server hasn't finished indexing.
Please wait a minute or so (untill the index has finished) and try again.
If the issue still persists please raise an issue.

## Release Notes
See [CHANGLOG.md](/CHANGELOG.md)

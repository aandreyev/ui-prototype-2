# UI Prototype 2

Initial scaffold for the project. Currently the repository is empty besides this README and supporting configuration files.

## Reference Code (Non-shipping)

This repo includes git submodules under `reference/`:

- `reference/ALP` → `AndreyevLawyers/ALP`
- `reference/alp-business-logic` → `aandreyev/alp-business-logic`

They are for reference only (architecture, patterns) and are excluded from diffs via `.gitmodules` `ignore = dirty` so local changes there won't appear in status. Do not import code directly from these reference modules into shipping `src/` — replicate patterns instead.

### Submodule Protection Hook

A pre-commit hook in `.githooks/pre-commit` blocks committing updates to any reference submodule pointer (unless you explicitly allow it):

Allow intentional pointer update:

```bash
ALLOW_SUBMODULE_UPDATE=1 git commit -m "update reference submodule"
```

Install hooks locally (once):

```bash
git config core.hooksPath .githooks
```

## Getting Started

1. (Optional) Decide the tech stack and add source files under an appropriate directory (e.g. `src/`).
2. Update this README with project purpose, setup, and usage instructions.

## Development

Add your project files and keep this section updated.

## License

Choose a license (MIT, Apache-2.0, etc.) and add a `LICENSE` file if you plan to make the project public.

## Contributing

Open issues and pull requests once the remote GitHub repository is created.

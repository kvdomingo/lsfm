FROM python:3.10-bullseye as base

ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONFAULTHANDLER 1
ENV PYTHONHASHSEED random
ENV PIP_NO_CACHE_DIR off
ENV PIP_DISABLE_PIP_VERSION_CHECK on
ENV PIP_DEFAULT_TIMEOUT 100
ENV POETRY_VERSION 1.1.12
ENV VERSION $VERSION

FROM base as dev

RUN pip install "poetry==$POETRY_VERSION"

WORKDIR /backend

COPY poetry.lock pyproject.toml ./

RUN poetry config virtualenvs.create false && \
    poetry install --no-interaction --no-ansi

ENTRYPOINT gunicorn lsfm.wsgi -k gevent -b 0.0.0.0:5000 --log-file - --capture-output --reload

FROM node:16-alpine as web-build

WORKDIR /web

COPY ./web/app/package.json ./web/app/yarn.lock ./

RUN yarn install

COPY ./web/app ./

RUN yarn build --prod

FROM base as build

RUN pip install "poetry==$POETRY_VERSION"

RUN python -m venv /venv

WORKDIR /tmp

COPY poetry.lock pyproject.toml ./

RUN poetry export -f requirements.txt

RUN /venv/bin/pip install -r requirements.txt

FROM base as prod

WORKDIR /backend

COPY ./lsfm/ ./
COPY --from=build /venv /venv
COPY --from=web-build ./web/build ./web/app

EXPOSE $PORT

ENTRYPOINT /venv/bin/activate && \
           gunicorn lsfm.wsgi -k gevent -b 0.0.0.0:$PORT --log-file - --capture-output

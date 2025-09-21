import enum
from typing import Any, Type

from sqlalchemy import Enum as SAEnum
from sqlalchemy.orm import mapped_column

def enum_column(enum_cls: Type[enum.Enum], **kwargs: Any) -> mapped_column:
    """Возвращает SQLAlchemy Enum столбец с правильным именем."""  # noqa: RUF002
    return mapped_column(
        SAEnum(
            enum_cls,
            name=f"{enum_cls.__name__.lower()}",
            native_enum=True,
            values_callable=lambda obj: [e.value for e in obj],
            validate_strings=True,
        ),
        **kwargs,
    )

class RoleEnum(str,enum.Enum):

    worker = "worker"
    manager = "manager"
    admin = "admin"

class StatusEnum(str,enum.Enum):

    ok = "ok"
    manual_check = "manual_check"

class TypeEnum(str,enum.Enum):

    give = "give"
    take = "take"
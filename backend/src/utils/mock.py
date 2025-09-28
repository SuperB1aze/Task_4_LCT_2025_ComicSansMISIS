import asyncio
from src.utils.database import db_manager, get_db_session
from src.models.models import Tool, ToolKit, ToolKitItem
from src.repo.base import BaseRepo


class ToolRepo(BaseRepo):
    model = Tool


class ToolKitRepo(BaseRepo):
    model = ToolKit


class ToolKitItemRepo(BaseRepo):
    model = ToolKitItem


async def check_database_empty() -> bool:
    """Проверяет, пуста ли база данных"""
    async for session in get_db_session():
        tool_repo = ToolRepo(session)
        toolkit_repo = ToolKitRepo(session)
        
        tool_count = await tool_repo.count()
        toolkit_count = await toolkit_repo.count()
        
        return tool_count == 0 and toolkit_count == 0


async def create_mock_data():
    """Создает mock данные для инструментов и набора"""
    
    if not await check_database_empty():
        print("База данных уже содержит данные. Mock скрипт не будет выполняться.")
        return
    
    print("База данных пуста. Начинаем создание mock данных...")
    
    async for session in get_db_session():
        tool_repo = ToolRepo(session)
        toolkit_repo = ToolKitRepo(session)
        toolkit_item_repo = ToolKitItemRepo(session)
        
        toolkit_data = {
            "id": 1,
            "name": "Основной набор инструментов",
            "description": "Стандартный набор инструментов для технических работ"
        }
        
        toolkit_stmt = toolkit_repo.model.__table__.insert().values(**toolkit_data)
        await session.execute(toolkit_stmt)
        await session.flush()
        
        tools_data = [
            {"id": 1, "name": "Отвертка «-»", "serial_number": "TOOL-001", "category": "Отвертки"},
            {"id": 2, "name": "Отвертка «+»", "serial_number": "TOOL-002", "category": "Отвертки"},
            {"id": 3, "name": "Отвертка на смещенный крест", "serial_number": "TOOL-003", "category": "Отвертки"},
            {"id": 4, "name": "Коловорот", "serial_number": "TOOL-004", "category": "Сверлильные инструменты"},
            {"id": 5, "name": "Пассатижи контровочные", "serial_number": "TOOL-005", "category": "Пассатижи"},
            {"id": 6, "name": "Пассатижи", "serial_number": "TOOL-006", "category": "Пассатижи"},
            {"id": 7, "name": "Шэрница", "serial_number": "TOOL-007", "category": "Режущие инструменты"},
            {"id": 8, "name": "Разводной ключ", "serial_number": "TOOL-008", "category": "Ключи"},
            {"id": 9, "name": "Открывашка для банок с маслом", "serial_number": "TOOL-009", "category": "Специальные инструменты"},
            {"id": 10, "name": "Ключ рожковый/накидной 3⁄4", "serial_number": "TOOL-010", "category": "Ключи"},
            {"id": 11, "name": "Бокорезы", "serial_number": "TOOL-011", "category": "Режущие инструменты"}
        ]
        
        for tool_data in tools_data:
            tool_stmt = tool_repo.model.__table__.insert().values(**tool_data)
            await session.execute(tool_stmt)
            await session.flush()
        
        toolkit_items_data = [
            {"tool_id": 1, "toolkit_id": 1, "quantity": 1},
            {"tool_id": 2, "toolkit_id": 1, "quantity": 1},
            {"tool_id": 3, "toolkit_id": 1, "quantity": 1},
            {"tool_id": 4, "toolkit_id": 1, "quantity": 1},
            {"tool_id": 5, "toolkit_id": 1, "quantity": 1},
            {"tool_id": 6, "toolkit_id": 1, "quantity": 1},
            {"tool_id": 7, "toolkit_id": 1, "quantity": 1},
            {"tool_id": 8, "toolkit_id": 1, "quantity": 1},
            {"tool_id": 9, "toolkit_id": 1, "quantity": 1},
            {"tool_id": 10, "toolkit_id": 1, "quantity": 1},
            {"tool_id": 11, "toolkit_id": 1, "quantity": 1}
        ]
        
        for item_data in toolkit_items_data:
            item_stmt = toolkit_item_repo.model.__table__.insert().values(**item_data)
            await session.execute(item_stmt)
            await session.flush()
        
        await session.commit()
        
        print("Mock данные успешно созданы!")
        print("Создан набор инструментов с id=1")
        print(f"Добавлено {len(tools_data)} инструментов")
        print(f"Создано {len(toolkit_items_data)} связей между набором и инструментами")


async def main():
    """Главная функция для запуска mock скрипта"""
    try:
        await db_manager.create_engine()
        
        await create_mock_data()
        
    except Exception as e:
        print(f"Ошибка при создании mock данных: {e}")
    finally:
        await db_manager.close_engine()


if __name__ == "__main__":
    asyncio.run(main())

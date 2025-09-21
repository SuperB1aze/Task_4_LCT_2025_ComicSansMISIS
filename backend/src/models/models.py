from sqlalchemy import (
    Integer, String, Text, DateTime, Boolean,
    ForeignKey
)
from datetime import datetime
from sqlalchemy.orm import relationship, Mapped, mapped_column
from src.models.base import BaseModel as Base
from src.models.enums import StatusEnum, TypeEnum, enum_column, RoleEnum

class User(Base):  # пользователь системы
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String, nullable=False)
    employee_number: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    role: Mapped[RoleEnum | None] = enum_column(RoleEnum, nullable=True)
    transactions = relationship("Transaction", back_populates="user")
    qa_reports = relationship("QAReport", back_populates="inspector")


class Tool(Base):  # инструменты
    __tablename__ = "tools"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String, nullable=False)
    serial_number: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    category: Mapped[str] = mapped_column(String, nullable=False)

    toolkit_items = relationship("ToolKitItem", back_populates="tool")


class ToolKit(Base):  # набор инструментов
    __tablename__ = "toolkits"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String, nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)

    items = relationship("ToolKitItem", back_populates="toolkit")
    transactions = relationship("Transaction", back_populates="toolkit")


class ToolKitItem(Base):  # содержимое набора инструментов
    __tablename__ = "toolkit_items"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    tool_id: Mapped[int] = mapped_column(Integer, ForeignKey("tools.id"), nullable=False)
    toolkit_id: Mapped[int] = mapped_column(Integer, ForeignKey("toolkits.id"), nullable=False)
    quantity: Mapped[int] = mapped_column(Integer, nullable=False)

    tool = relationship("Tool", back_populates="toolkit_items")
    toolkit = relationship("ToolKit", back_populates="items")


class Transaction(Base):  # передача набора
    __tablename__ = "transactions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False)
    toolkit_id: Mapped[int] = mapped_column(Integer, ForeignKey("toolkits.id"), nullable=False)
    type: Mapped[TypeEnum | None] = enum_column(TypeEnum, nullable=True)
    transaction_time: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    status: Mapped[StatusEnum | None] = enum_column(StatusEnum, nullable=True)

    user = relationship("User", back_populates="transactions")
    toolkit = relationship("ToolKit", back_populates="transactions")
    details = relationship("TransactionDetail", back_populates="transaction")
    qa_reports = relationship("QAReport", back_populates="transaction")


class TransactionDetail(Base):  # детали передачи
    __tablename__ = "transaction_details"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    transaction_id: Mapped[int] = mapped_column(Integer, ForeignKey("transactions.id"), nullable=False)
    expected_qty: Mapped[int] = mapped_column(Integer, nullable=False)
    actual_qty: Mapped[int] = mapped_column(Integer, nullable=False)
    discrepancy: Mapped[bool] = mapped_column(Boolean, nullable=False)

    transaction = relationship("Transaction", back_populates="details")


class QAReport(Base):  # отчёты при проверках
    __tablename__ = "qa_reports"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    transaction_id: Mapped[int] = mapped_column(Integer, ForeignKey("transactions.id"), nullable=False)
    inspector_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False)
    report_text: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False)

    transaction = relationship("Transaction", back_populates="qa_reports")
    inspector = relationship("User", back_populates="qa_reports")
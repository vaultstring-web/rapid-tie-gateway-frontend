'use client';

import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { GripVertical, Edit2, Trash2, Power, Play, AlertCircle, CheckCircle, Shield } from 'lucide-react';
import { FraudRule, FRAUD_CATEGORIES, RULE_ACTIONS } from '@/types/admin/fraud';
import { formatDateTime } from '@/lib/utils/format';
import { useTheme } from '@/context/ThemeContext';

interface FraudRulesListProps {
  rules: FraudRule[];
  loading?: boolean;
  onToggleRule?: (ruleId: string, enabled: boolean) => void;
  onEditRule?: (rule: FraudRule) => void;
  onDeleteRule?: (ruleId: string) => void;
  onReorderRules?: (ruleIds: string[]) => void;
  onTestRule?: (rule: FraudRule) => void;
}

export const FraudRulesList = ({ 
  rules, 
  loading, 
  onToggleRule, 
  onEditRule, 
  onDeleteRule, 
  onReorderRules,
  onTestRule 
}: FraudRulesListProps) => {
  const { theme } = useTheme();

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || !onReorderRules) return;
    
    const items = Array.from(rules);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    onReorderRules(items.map(item => item.id));
  };

  const getCategoryConfig = (category: string) => {
    return FRAUD_CATEGORIES.find(c => c.value === category) || FRAUD_CATEGORIES[0];
  };

  const getActionConfig = (action: string) => {
    return RULE_ACTIONS.find(a => a.value === action) || RULE_ACTIONS[0];
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 80) return 'text-green-500';
    if (accuracy >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-xl p-4 animate-pulse bg-[var(--bg-secondary)] border border-[var(--border-color)]">
            <div className="flex gap-3">
              <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-48" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (rules.length === 0) {
    return (
      <div className="text-center py-12">
        <Shield size={48} className="mx-auto mb-4 opacity-50 text-[var(--text-secondary)]" />
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">No Fraud Rules</h3>
        <p className="text-sm text-[var(--text-secondary)]">Create your first fraud detection rule</p>
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="rules">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
            {rules.map((rule, index) => {
              const categoryConfig = getCategoryConfig(rule.category);
              const actionConfig = getActionConfig(rule.action);
              
              return (
                <Draggable key={rule.id} draggableId={rule.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`rounded-xl p-4 border transition-all ${
                        snapshot.isDragging ? 'shadow-lg ring-2 ring-[#84cc16]' : 'hover:shadow-md'
                      } ${!rule.enabled ? 'opacity-60' : ''}`}
                      style={{
                        backgroundColor: 'var(--bg-secondary)',
                        borderColor: 'var(--border-color)',
                        ...provided.draggableProps.style,
                      }}
                    >
                      <div className="flex items-start gap-3">
                        {/* Drag Handle */}
                        <div {...provided.dragHandleProps} className="cursor-grab active:cursor-grabbing mt-1">
                          <GripVertical size={20} className="text-[var(--text-secondary)]" />
                        </div>

                        {/* Rule Content */}
                        <div className="flex-1">
                          <div className="flex flex-wrap justify-between items-start gap-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-lg font-semibold text-[var(--text-primary)]">{rule.name}</h3>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1`}
                                style={{ backgroundColor: `${categoryConfig.color}20`, color: categoryConfig.color }}>
                                <span>{categoryConfig.icon}</span>
                                {categoryConfig.label}
                              </span>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1`}
                                style={{ backgroundColor: `${actionConfig.color}20`, color: actionConfig.color }}>
                                {actionConfig.label}
                              </span>
                              {rule.metrics.accuracy >= 80 && (
                                <span className="px-2 py-0.5 rounded-full text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                                  High Accuracy
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => onToggleRule?.(rule.id, !rule.enabled)}
                                className={`p-1.5 rounded-lg transition-colors ${
                                  rule.enabled 
                                    ? 'text-green-500 hover:bg-green-100 dark:hover:bg-green-900/20' 
                                    : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
                                }`}
                                title={rule.enabled ? 'Disable Rule' : 'Enable Rule'}
                              >
                                <Power size={16} />
                              </button>
                              <button
                                onClick={() => onTestRule?.(rule)}
                                className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/20 transition-colors"
                                title="Test Rule"
                              >
                                <Play size={16} />
                              </button>
                              <button
                                onClick={() => onEditRule?.(rule)}
                                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                style={{ color: 'var(--text-primary)' }}
                              >
                                <Edit2 size={16} />
                              </button>
                              <button
                                onClick={() => onDeleteRule?.(rule.id)}
                                className="p-1.5 rounded-lg text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>

                          <p className="text-sm text-[var(--text-secondary)] mt-1">{rule.description}</p>
                          <p className="text-xs font-mono text-[var(--text-secondary)] mt-2">
                            Condition: {rule.condition}
                          </p>

                          {/* Metrics */}
                          <div className="mt-3 grid grid-cols-3 gap-4 pt-3 border-t" style={{ borderColor: 'var(--border-color)' }}>
                            <div>
                              <p className="text-xs text-[var(--text-secondary)]">Triggers</p>
                              <p className="text-lg font-semibold text-[var(--text-primary)]">{rule.metrics.triggers.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-xs text-[var(--text-secondary)]">Accuracy</p>
                              <p className={`text-lg font-semibold ${getAccuracyColor(rule.metrics.accuracy)}`}>
                                {rule.metrics.accuracy}%
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-[var(--text-secondary)]">Last Triggered</p>
                              <p className="text-sm font-medium text-[var(--text-primary)]">
                                {rule.metrics.lastTriggered ? formatDateTime(rule.metrics.lastTriggered) : 'Never'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};
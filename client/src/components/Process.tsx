import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Database, FlaskConical, Rocket, Activity, GitBranch, FileCode } from 'lucide-react';

interface ProcessStep {
  id: string;
  title: string;
  description: string;
  icon: typeof Database;
  artifacts?: Array<{ name: string; url: string }>;
  tools: string[];
}

const processSteps: ProcessStep[] = [
  {
    id: 'data-sourcing',
    title: 'Data Sourcing & Engineering',
    description: 'Collect, clean, and prepare datasets for model training. Handle missing values, outliers, and feature engineering to maximize signal quality.',
    icon: Database,
    tools: ['Pandas', 'NumPy', 'SQL', 'Apache Spark'],
    artifacts: [
      { name: 'Data Pipeline Notebook', url: '#' },
      { name: 'EDA Report', url: '#' },
    ],
  },
  {
    id: 'experimentation',
    title: 'Experimentation & Hyperparameter Tuning',
    description: 'Iterate on model architectures, loss functions, and hyperparameters. Track experiments systematically to identify best-performing configurations.',
    icon: FlaskConical,
    tools: ['Scikit-learn', 'TensorFlow', 'PyTorch', 'Optuna'],
    artifacts: [
      { name: 'Experiment Logs', url: '#' },
      { name: 'Model Comparison', url: '#' },
    ],
  },
  {
    id: 'deployment',
    title: 'Deployment & Serving',
    description: 'Package models into production-ready APIs with proper versioning, monitoring, and rollback capabilities for reliable inference at scale.',
    icon: Rocket,
    tools: ['FastAPI', 'Docker', 'AWS SageMaker', 'TensorFlow Serving'],
    artifacts: [
      { name: 'API Documentation', url: '#' },
      { name: 'Deployment Guide', url: '#' },
    ],
  },
  {
    id: 'mlops',
    title: 'MLOps & Monitoring',
    description: 'Continuous monitoring of model performance, data drift, and system health. Automated retraining pipelines to maintain accuracy over time.',
    icon: Activity,
    tools: ['MLflow', 'Weights & Biases', 'Prometheus', 'Grafana'],
    artifacts: [
      { name: 'Monitoring Dashboard', url: '#' },
      { name: 'Drift Analysis', url: '#' },
    ],
  },
];

export function Process() {
  return (
    <section
      id="process"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-background"
      data-testid="section-process"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight mb-4">
            ML Model Lifecycle
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            End-to-end process from raw data to production-ready AI systems
          </p>
        </div>

        {/* Vertical Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border md:left-1/2 md:-ml-px" />

          <div className="space-y-12">
            {processSteps.map((step, index) => {
              const Icon = step.icon;
              const isEven = index % 2 === 0;

              return (
                <div
                  key={step.id}
                  className="relative grid md:grid-cols-2 gap-8 items-center"
                  data-testid={`process-step-${step.id}`}
                >
                  {/* Content - left on desktop for even items */}
                  <div
                    className={`${
                      isEven ? 'md:text-right md:pr-12' : 'md:col-start-2 md:pl-12'
                    } pl-20 md:pl-0`}
                  >
                    <Card className="p-6 hover-elevate transition-all duration-300">
                      <div className="flex items-start gap-4 md:hidden">
                        <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                        </div>
                      </div>

                      <div className="hidden md:block mb-3">
                        <h3 className="text-xl font-semibold">{step.title}</h3>
                      </div>

                      <p className="text-muted-foreground mb-4">{step.description}</p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {step.tools.map((tool) => (
                          <Badge key={tool} variant="secondary" className="text-xs">
                            {tool}
                          </Badge>
                        ))}
                      </div>

                      {step.artifacts && step.artifacts.length > 0 && (
                        <div className="space-y-1">
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                            Artifacts
                          </p>
                          {step.artifacts.map((artifact) => (
                            <a
                              key={artifact.name}
                              href={artifact.url}
                              className="flex items-center gap-2 text-sm text-primary hover:underline"
                            >
                              <FileCode className="w-3 h-3" />
                              {artifact.name}
                            </a>
                          ))}
                        </div>
                      )}
                    </Card>
                  </div>

                  {/* Icon circle in the center */}
                  <div
                    className={`absolute left-8 md:left-1/2 md:-ml-8 top-6 md:top-1/2 md:-mt-8 w-16 h-16 bg-card border-4 border-background rounded-full flex items-center justify-center shadow-lg z-10 ${
                      isEven ? '' : 'md:order-first'
                    }`}
                  >
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* MLOps Stack Card */}
        <Card className="mt-16 p-8 bg-muted/30">
          <div className="flex items-center gap-3 mb-6">
            <GitBranch className="w-6 h-6 text-primary" />
            <h3 className="text-2xl font-semibold">MLOps Stack</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Version Control
              </h4>
              <div className="flex flex-wrap gap-2">
                {['Git', 'DVC', 'MLflow'].map((tool) => (
                  <Badge key={tool} variant="outline">
                    {tool}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Infrastructure
              </h4>
              <div className="flex flex-wrap gap-2">
                {['Docker', 'Kubernetes', 'AWS', 'Terraform'].map((tool) => (
                  <Badge key={tool} variant="outline">
                    {tool}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                CI/CD & Testing
              </h4>
              <div className="flex flex-wrap gap-2">
                {['GitHub Actions', 'Pytest', 'Great Expectations'].map((tool) => (
                  <Badge key={tool} variant="outline">
                    {tool}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
